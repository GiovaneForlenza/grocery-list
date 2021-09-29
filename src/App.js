import logo from './logo.svg';
import './App.css';
import List from './List';
import Alert from './Alert';
import React, { useState, useEffect } from 'react'

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  }
  return []

}

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'Please enter a value')
    } else if (name && isEditing) {
      setList(list.map((item) => {
        if (item.id === editID) {
          return { ...item, title: name }
        }
        return item
      }))
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'item updated')
    } else {
      showAlert(true, 'success', 'Item added to the list')
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
    }
  }

  const showAlert = (show = false, type = '', message = '') => {
    setAlert({ show, type, message })
  }
  const clearList = () => {
    showAlert(true, 'danger', 'list cleared');
    setList([])
  }
  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    setList(list.filter((item) => item.id !== id));
  }
  const editItem = (id) => {
    const itemEdit = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(itemEdit.title)

  }
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  })
  return (
    <section className="section-center">
      <form action="" className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input type="text" className='grocery' placeholder='eg. eggs' value={name} onChange={(e) => setName(e.target.value)} />
          <button className="submit-btn" type='submit'>{isEditing ? 'edit' : 'submit'}</button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>clear items</button>
        </div>
      )}
    </section>
  );
}

export default App;
