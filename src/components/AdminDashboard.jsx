import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [formulas, setFormulas] = useState([]);
  const [newFormula, setNewFormula] = useState({ name: '', description: '', price: '', duration: '' });
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [newAppointment, setNewAppointment] = useState({
    client_id: '',
    formula_id: '',
    date: '',
    time: '',

  });

  useEffect(() => {
    fetchFormulas();
    fetchAppointments();
    fetchClients();
  }, []);

  const fetchFormulas = async () => {
    const { data, error } = await supabase
      .from('formulas')
      .select('*')
      .order('name');
    if (error) console.error('Error fetching formulas:', error);
    else setFormulas(data || []);
  };

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    if (error) console.error('Error fetching clients:', error);
    else setClients(data || []);
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, clients(*)')
      .order('date');
    if (error) console.error('Error fetching appointments:', error);
    else setAppointments(data || []);
  };

  const addFormula = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('formulas')
      .insert([{
        ...newFormula,
        price: parseFloat(newFormula.price),
        duration: parseInt(newFormula.duration)
      }]);
    if (error) {
      console.error('Error adding formula:', error);
      alert('Error adding formula');
    } else {
      setNewFormula({ name: '', description: '', price: '', duration: '' });
      fetchFormulas();
    }
  };

  const addClient = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('clients')
      .insert([newClient]);
    if (error) {
      console.error('Error adding client:', error);
      alert('Error adding client');
    } else {
      setNewClient({ name: '', email: '', phone: '' });
      fetchClients();
    }
  };

  const addAppointment = async (e) => {
    e.preventDefault();

    // Ensure a valid time value before submission
    if (!newAppointment.time || newAppointment.time === '') {
      alert('Please select a valid time for the appointment.');
      return;
    }

 

    const { error } = await supabase
      .from('appointments')
      .insert([newAppointment]);

    if (error) {
      console.error('Error adding appointment:', error);
      alert('Error adding appointment');
    } else {
      setNewAppointment({
        client_id: '',
        formula_id: '',
        date: '',
        time: '',
       
      });
      fetchAppointments();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Client Management */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
        <form onSubmit={addClient} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Client Name"
              value={newClient.name}
              onChange={(e) => setNewClient({...newClient, name: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newClient.email}
              onChange={(e) => setNewClient({...newClient, email: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newClient.phone}
              onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
              className="border p-2 rounded"
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Client
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clients && clients.length > 0 ? (
            clients.map(client => (
              <div key={client.id} className="border p-4 rounded">
                <h3 className="font-bold">{client.name}</h3>
                <p className="text-gray-600">{client.email}</p>
                <p className="text-gray-500">{client.phone}</p>
              </div>
            ))
          ) : (
            <p>No clients available.</p>
          )}
        </div>
      </div>

      {/* Formula Management */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manage Formulas</h2>
        <form onSubmit={addFormula} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Formula Name"
              value={newFormula.name}
              onChange={(e) => setNewFormula({...newFormula, name: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newFormula.description}
              onChange={(e) => setNewFormula({...newFormula, description: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newFormula.price}
              onChange={(e) => setNewFormula({...newFormula, price: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={newFormula.duration}
              onChange={(e) => setNewFormula({...newFormula, duration: e.target.value})}
              className="border p-2 rounded"
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Formula
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formulas && formulas.length > 0 ? (
            formulas.map(formula => (
              <div key={formula.id} className="border p-4 rounded">
                <h3 className="font-bold">{formula.name}</h3>
                <p className="text-gray-600">{formula.description}</p>
                <p className="text-gray-500">{formula.price}</p>
                <p className="text-gray-500">{formula.duration} min</p>
              </div>
            ))
          ) : (
            <p>No formulas available.</p>
          )}
        </div>
      </div>

      {/* Appointment Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Appointment</h2>
        <form onSubmit={addAppointment}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={newAppointment.client_id}
              onChange={(e) => setNewAppointment({...newAppointment, client_id: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Client</option>
              {clients && clients.length > 0 ? (
                clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))
              ) : (
                <option>No clients available</option>
              )}
            </select>

            <select
              value={newAppointment.formula_id}
              onChange={(e) => setNewAppointment({...newAppointment, formula_id: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Formula</option>
              {formulas && formulas.length > 0 ? (
                formulas.map(formula => (
                  <option key={formula.id} value={formula.id}>{formula.name}</option>
                ))
              ) : (
                <option>No formulas available</option>
              )}
            </select>

            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Appointment
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments && appointments.length > 0 ? (
            appointments.map(appointment => (
              <div key={appointment.id} className="border p-4 rounded">
                <h3 className="font-bold">{appointment.clients?.name}</h3>
                <p className="text-gray-600">{format(new Date(appointment.date), 'MM/dd/yyyy')} at {appointment.time}</p>
                <p className="text-green-600">{appointment.formulas?.name}</p>
               
              </div>
            ))
          ) : (
            <p>No appointments available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
