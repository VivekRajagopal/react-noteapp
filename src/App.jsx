import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import CreateNote from './CreateNote';
import NoteItem from './NoteItem';

import './App.css';
import './Button.css';

const sampleNotes = [
    { id: 0, title: "Shopping", body: "Eggs, Bread, Milk" },
    { id: 1, title: "Chores", body: "Dishes, laundry, {}ing" },
    { id: 2, title: "Some more tasks", body: "Done already...?" }
];

class App extends Component {
    constructor() {
        super();
        this.state = {
            notes: [],
            searchTerm: "",
            dragID: -1
        }
        window.document.title = "React Noteapp";

        this.lastID = sampleNotes.map(el => el.id).reduce((a, b) => Math.max(a, b));

        this.setSampleNotes = this.setSampleNotes.bind(this);
        this.setLotsaNotes = this.setLotsaNotes.bind(this);
        this.createNote = this.createNote.bind(this);
        this.editNote = this.editNote.bind(this);
        this.completeNote = this.completeNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.reorderNote = this.reorderNote.bind(this);

        this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
    }

    //Load local storage notes into state if it exists
    componentDidMount() {
        const notes = JSON.parse(localStorage.getItem("notes"));
        if (notes) {
            this.setState({ notes });
            this.lastID = (notes.length ? notes.map(el => el.id).reduce((a, b) => Math.max(a, b)) : 0);
        }
    }

    setSampleNotes() {
        sampleNotes.forEach(note => this.createNote(note));
    }

    setLotsaNotes() {
        [...Array(100).keys()].forEach(i => this.createNote({ title: i.toString(), body: 'Test' + i.toString() }));
    }

    createNote(note) {
        let notes = this.state.notes;

        notes.push({ id: this.lastID + 1, title: note.title, body: note.body });
        this.setState({ notes });

        this.lastID++;

        this.saveToLocalStorage(notes);
    }

    editNote(noteID, newNote) {
        let notes = this.state.notes;
        const note = notes.filter(note => note.id === noteID)[0];
        note.title = newNote.title;
        note.body = newNote.body;
        this.setState({ notes });

        this.saveToLocalStorage(notes);
    }

    completeNote(noteID) {
        let notes = this.state.notes;
        const note = notes.filter(note => note.id === noteID)[0];
        note.complete = !note.complete;
        if (note.complete) note.tags = ['complete'];
        else note.tags = [];
        
        this.setState({ notes });

        this.saveToLocalStorage(notes);
    }

    deleteNote(noteID) {
        let notes = this.state.notes;
        notes = notes.filter(note => note.id !== noteID);
        this.setState({ notes });

        this.saveToLocalStorage(notes);
    }

    deleteAllNotes() {
        const result = window.prompt('Are you sure? Enter "Yes I am sure" below to delete all your notes! This cannot be undone!', 'Lemme think about that...');
        if (result !== "Yes I am sure") return;
        this.setState({ notes: [] });
        this.saveToLocalStorage([]);
        this.lastID = -1;
    }

    dragStart(dragID) { this.setState({ dragID }) }

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
        const filteredNotes = this.state.notes.filter(note => {
            return (
                note.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                note.body.toLowerCase().includes(this.state.searchTerm.toLowerCase())
            )
        });

        return (
            <div className="App">
                <div className="creator-bar">
                    <h1 className="hide-mobile">NOTED</h1>
                    <CreateNote addNote={this.createNote} />
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search notes..."
                        value={this.state.searchTerm}
                        onChange={ev => this.setState({ searchTerm: ev.currentTarget.value })} />
                    <button className="btn btn-delete hide-mobile" onClick={ev => this.deleteAllNotes()}>☠️ x Clear All Notes x ☠️</button>
                </div>
                <div className="note-list-container">
                    <div className="note-list">
                        {filteredNotes.map((note, i) =>
                            <NoteItem
                                className={`note-item-container ${(note.complete) ? "note-item-complete" : ""}`}
                                editNote={this.editNote}
                                completeNote={this.completeNote}
                                deleteNote={this.deleteNote}
                                dragStart={this.dragStart}
                                reorderNote={this.reorderNote}
                                key={i}
                                note={note} />
                        )}
                        {this.state.notes.length ?
                            <span></span> :
                            <div>
                                <button className="btn btn-strong" onClick={this.setSampleNotes}>Create some sample notes to get started!</button>

                                {/*
                                <button className="btn btn-strong" onClick={this.setLotsaNotes}>Bulk Notes</button>
                                */}
                            </div>

                        }
                    </div>
                </div>


                <a target="_blank" rel="noopener noreferrer" href="http://vivek-rajagopal.net" className="home-link">Created by Vivek Rajagopal</a>
            </div>
        );
    }
}

export default hot(module)(App);