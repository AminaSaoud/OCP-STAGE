import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Layout from '../components/Layout';


const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function Calendrier() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [joursFeries, setJoursFeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = currentDate.getFullYear();
    setLoading(true);
    
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/MA`)
      .then(res => res.json())
      .then(data => {
        const feriesDates = data.map(j => j.date);
        setJoursFeries(feriesDates);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des jours fériés:', error);
        setLoading(false);
      });
  }, [currentDate.getFullYear()]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Ajouter les jours du mois précédent pour compléter la première semaine
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = new Date(year, month, -i);
      days.push({
        date: prevDay,
        isCurrentMonth: false,
        day: prevDay.getDate()
      });
    }

    // Ajouter tous les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date: date,
        isCurrentMonth: true,
        day: day
      });
    }

    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const nextDay = new Date(year, month + 1, day);
      days.push({
        date: nextDay,
        isCurrentMonth: false,
        day: nextDay.getDate()
      });
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Dimanche ou Samedi
  };

  const isJourFerie = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return joursFeries.includes(dateStr);
  };

  const getDayClass = (dayObj) => {
    const { date, isCurrentMonth } = dayObj;
    let classes = "h-12 w-12 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ";

    if (!isCurrentMonth) {
      classes += "text-gray-300 ";
    } else {
      classes += "text-gray-800 hover:bg-gray-100 ";
      
      if (isToday(date)) {
        classes += "bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 ";
      } else if (isJourFerie(date)) {
        classes += "bg-red-100 text-red-700 font-semibold border-2 border-red-200 ";
      } else if (isWeekend(date)) {
        classes += "bg-blue-50 text-blue-600 ";
      }
    }

    return classes;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Calendrier Marocain</h1>
          </div>
          <p className="text-gray-600">Jours fériés et weekends du Maroc</p>
        </div>

        {/* Contrôles de navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth(-1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Précédent
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={goToToday}
                  className="text-sm text-green-100 hover:text-white transition-colors mt-1"
                >
                  Aller à aujourd'hui
                </button>
              </div>
              
              <button
                onClick={() => navigateMonth(1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendrier */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Chargement des jours fériés...</span>
              </div>
            ) : (
              <>
                {/* En-têtes des jours */}
                <div className="grid grid-cols-7 mb-4">
                  {DAYS.map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grille du calendrier */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((dayObj, index) => (
                    <div
                      key={index}
                      className={getDayClass(dayObj)}
                      title={
                        dayObj.isCurrentMonth && isJourFerie(dayObj.date) 
                          ? "Jour férié" 
                          : dayObj.isCurrentMonth && isWeekend(dayObj.date) 
                            ? "Weekend" 
                            : ""
                      }
                    >
                      {dayObj.day}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Légende */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-200 rounded"></div>
                <span className="text-gray-700">Jour férié</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 rounded"></div>
                <span className="text-gray-700">Weekend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700">Aujourd'hui</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            Les jours fériés sont basés sur le calendrier officiel marocain.
            Les weekends incluent le samedi et le dimanche.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Calendrier;