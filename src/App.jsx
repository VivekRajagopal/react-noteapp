import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import CreateNote from './CreateNote';
import NoteItem from './NoteItem';

import './App.css';
import './Button.css';

const sampleNotes = [
    { id: 0, title: "Shopping", body: "Eggs, Bread, Milk" },
    { id: 1, title: "Chores", body: "Dishes, laundry, coding" },
    { id: 2, title: "Some more tasks", body: "Done already...?" }
];

class App extends Component {
    constructor() {
        super();
        this.state = {
            notes: sampleNotes
        }
        window.document.title = "React Noteapp";

        this.lastID = sampleNotes.length;

        this.setSampleNotes = this.setSampleNotes.bind(this);
        this.createNote = this.createNote.bind(this);
        this.completeNote = this.completeNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.reorderNote = this.reorderNote.bind(this);

        this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
    }

    //Load local storage notes into state if it exists
    componentDidMount() {
        const notes = JSON.parse(localStorage.getItem("notes"));
        if (notes) {
            this.setState({ notes });
        }
    }

    setSampleNotes() {
        sampleNotes.forEach(note => this.createNote(note));
    }

    createNote(note) {
        let notes = this.state.notes;
        if (!note.title) note = { title: note, body: "" };

        notes.push({ id: this.lastID, title: note.title, body: note.body });
        this.setState({ notes });

        this.lastID++;

        this.saveToLocalStorage(notes);
    }

    completeNote(noteID) {
        let notes = this.state.notes;
        const note = notes.filter(note => note.id === noteID);
        note[0].complete = !note[0].complete;
        this.setState({ notes });

        this.saveToLocalStorage(notes);
    }

    deleteNote(noteID) {
        let notes = this.state.notes;
        notes = notes.filter(note => note.id !== noteID);
        this.setState({ notes });

        this.saveToLocalStorage(notes);
    }

    reorderNote(dragID, targetID) {
        if (dragID == targetID) return;
        let notes = this.state.notes;
        const iDrag = notes.indexOf(notes.filter(note => note.id == dragID)[0]);
        const iTarget = notes.indexOf(notes.filter(note => note.id == targetID)[0]);

        const noteDrag = notes.splice(iDrag, 1)[0];     //Note being dragged
        notes.splice(iTarget, 0, noteDrag);             //Splice it in before the dragTarget note

        this.setState({ notes });

        this.saveToLocalStorage(notes);
    }

    saveToLocalStorage(notes = []) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    render() {
        return (
            <div className="App">
                <a className="home-link" href="/">Back home</a>
                <h1>Note Board</h1>
                <CreateNote addNote={this.createNote} />
                <div className="note-list">
                    {this.state.notes.map((note, i) =>
                        <NoteItem
                            className={`note-item-container ${(note.complete) ? "note-item-complete" : ""}`}
                            completeNote={this.completeNote}
                            deleteNote={this.deleteNote}
                            reorderNote={this.reorderNote}
                            key={i}
                            note={note} />
                    )}
                    {this.state.notes.length ?
                        <span></span> :
                        <button className="btn btn-strong" onClick={this.setSampleNotes}>Create some sample notes to get started!</button>
                    }
                </div>
            </div>
        );
    }
}

export default hot(module)(App);