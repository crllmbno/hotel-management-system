import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({ roomNo:'', name:'', contact:'', date:'' });
  const [editingRoomNo, setEditingRoomNo] = useState(null);

  useEffect(fetchRooms, []);

  function fetchRooms() {
    axios.get('http://localhost:8080/rooms')
      .then(res => {
      const sortedRooms = res.data.sort((a, b) => Number(a.roomNo) - Number(b.roomNo));
      setRooms(sortedRooms);
    })
    .catch(console.error);
  }

  function handleChange(e) {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const call = editingRoomNo
      ? axios.put(`http://localhost:8080/rooms/${editingRoomNo}`, formData)
      : axios.post('http://localhost:8080/rooms', formData);

    call
      .then(() => {
        fetchRooms();
        setFormData({ roomNo:'', name:'', contact:'', date:'' });
        setEditingRoomNo(null);
      })
      .catch(console.error);
  }

  function handleEdit(room) {
    setFormData(room);
    setEditingRoomNo(room.roomNo);
  }

  function handleDelete(roomNo) {
    axios.delete(`http://localhost:8080/rooms/${roomNo}`)
      .then(fetchRooms)
      .catch(console.error);
  }

  return (
    <div className="container-main">
      <h1 className="webTitle">Nexus Stays</h1>

      <div className="container-2">
        <h2 className="EditAdd">{editingRoomNo ? "Edit Form" : "Register Form"}</h2>
        <form onSubmit={handleSubmit} className="form-column">
          <div className="form-group">
            <input
              type="number"
              name="roomNo"
              placeholder="Room No."
              value={formData.roomNo}
              onChange={handleChange}
              className="form-control"
              disabled={!!editingRoomNo}
              min = "1"
              max = "50"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              maxLength="40"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="contact"
              placeholder="email or contact No."
              value={formData.contact}
              onChange={handleChange}
              className="form-control"
              maxLength="40"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="date"
              placeholder="Duration of Stay"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
              maxLength="40"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              {editingRoomNo ? "Update Room" : "Add Room"}
            </button>
          </div>
        </form>

      </div>

      <div className="row">
        {rooms.map((room, i) => (
          <div className="col-md-4" key={i}>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Room #{room.roomNo}</h5>
                <p className="card-text">
                  <strong>Name:</strong> {room.name} <br />
                  <strong>Contact:</strong> {room.contact} <br />
                  <strong>Date:</strong> {room.date}
                </p>
                <button onClick={() => handleEdit(room)} className="btn btn-warning me-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(room.roomNo)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}

export default App;
