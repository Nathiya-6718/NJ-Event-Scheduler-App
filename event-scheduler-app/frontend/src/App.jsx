import { useEffect, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "", description: "" });

  // ✅ Fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events"); // <-- fixed URL
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // ✅ Add new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) {
      alert("Please fill at least Title, Date, and Time!");
      return;
    }
    try {
      await fetch("http://localhost:5000/api/events", { // <-- fixed URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ title: "", date: "", time: "", location: "", description: "" });
      fetchEvents();
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // ✅ Delete event
  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" });
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📅 Event Scheduler</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /> <br/>
        <input placeholder="Date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /> <br/>
        <input placeholder="Time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} /> <br/>
        <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /> <br/>
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea> <br/>
        <button type="submit">Add Event</button>
      </form>

      <h2>Upcoming Events</h2>
      <ul>
        {events.map(ev => (
          <li key={ev._id}>
            <b>{ev.title}</b> — {ev.date} {ev.time} at {ev.location}
            <button onClick={() => deleteEvent(ev._id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
