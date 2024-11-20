import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';

export default function MasseurDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, formulas(*), clients(*)')
      .eq('date', selectedDate)
      .order('time');
      
    if (error) console.error('Error fetching appointments:', error);
    else setAppointments(data);
  };

  const updateAppointmentStatus = async (id, status) => {
    const { error } = await supabase
      .from('appointments')
  .select('*, clients(*)')
  .eq('client_id', someClientId);

    if (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment status');
    } else {
      fetchAppointments();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Daily Schedule</h1>
      
      <div className="mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments scheduled for this day</p>
        ) : (
          appointments.map(appointment => (
            <div key={appointment.id} className="border p-4 rounded-lg shadow bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{appointment.time}</h3>
                  <p className="text-gray-600">Client: {appointment.clients?.name}</p>
                  <p className="text-gray-600">Formula: {appointment.formulas?.name}</p>
                  <p className="text-gray-500">Duration: {appointment.formulas?.duration} minutes</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-center ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status}
                  </span>
                  {appointment.status !== 'completed' && (
                    <div className="flex flex-col gap-1 mt-2">
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Start
                        </button>
                      )}
                      {appointment.status === 'in_progress' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}