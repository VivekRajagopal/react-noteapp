import React, { Component } from 'react';
import './CreateNote.css';

class CreateNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteTitle: "",
            noteBody: ""
        }

        this.submitNewNote = this.submitNewNote.bind(this);
    }

    submitNewNote() {
        if (this.state.noteTitle) {
            this.props.addNote({ title: this.state.noteTitle, body: this.state.noteBody });
            this.setState({ noteTitle: "", noteBody: "" });
        }
    }

    render() {
        return (
            <form className="create-note-container" onSubmit={(e) => { e.preventDefault(); this.submitNewNote() }} >
                <div className="create-note-title">
                    <input
                        placeholder="Title"
                        type="text"
                        value={this.state.noteTitle}
                        onChange={(e) => this.setState({ noteTitle: e.target.value })}/>
                    <input
                        type="image"
                        src="https://img.icons8.com/color/32/000000/note.png"
                        alt="Create"
                        className="btn btn-strong"
                        tabIndex={2}
                        disabled={(this.state.noteTitle.trim() === "")} />
                </div>
                <div className="create-note-body">
                    <textarea
                        placeholder="Body"
                        type="textarea"
                        maxLength={200} 
                        value={this.state.noteBody}
                        onChange={(e) => this.setState({ noteBody: e.target.value })} />
                </div>

            </form>

        )
    }
}

export default CreateNote;