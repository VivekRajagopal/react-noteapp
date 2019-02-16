import React, { Component } from 'react';
import './CreateNote.css';

class CreateNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteTitle: "",
            noteBody: "",
            focussed: false
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
                <div className="create-note-row">
                    <input
                        placeholder={this.state.focussed ? "" : "Title"}
                        type="text"
                        value={this.state.noteTitle}
                        onChange={(e) => this.setState({ noteTitle: e.target.value })}
                        onFocus={ev => this.setState({ focussed: true })}
                        onBlur={ev => this.setState({ focussed: false })} />
                    <button tabIndex={2} disabled={(this.state.noteTitle === "")} className="btn btn-strong">Create</button>
                </div>
                <input
                    className="create-note-row"
                    placeholder="Body"
                    type="text"
                    value={this.state.noteBody}
                    onChange={(e) => this.setState({ noteBody: e.target.value })}
                />
            </form>

        )
    }
}

export default CreateNote;