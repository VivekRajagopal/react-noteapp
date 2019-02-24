import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import './NoteItem.css';

import Markdown from 'markdown-to-jsx';

const tagsToString = tags => {
    if (tags.length)
        return JSON.stringify(tags)
    else return ""
};

class NoteItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            dragging: false,
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.tag = this.tag.bind(this);
        this.edit = this.edit.bind(this);
        this.complete = this.complete.bind(this);
        this.delete = this.delete.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    //Wip
    toggleEdit(event) {
        if (this.state.editing) this.edit(event);
        else {
            event.stopPropagation();
            this.setState({
                editTitle: this.props.note.title,
                editBody: this.props.note.body,
                editing: !this.state.editing,
            });
        }
    }

    edit(event) {
        event.stopPropagation();
        this.props.editNote(this.props.note.id, { title: this.state.editTitle, body: this.state.editBody });
        this.setState({
            editing: false,
            editTitle: this.props.note.title,
            editBody: this.props.note.body,
        })
    }

    complete(event) {
        event.stopPropagation();
        this.props.completeNote(this.props.note.id);
    }

    tag(event) {

    }

    delete(event) {
        event.stopPropagation();
        this.props.deleteNote(this.props.note.id);
    }

    onDragStart(event) {
        this.setState({ dragging: true })
        event.dataTransfer.setData('noteID', this.props.note.id);
    }

    onDragOver(event) {
        this.props.reorderNote(event.dataTransfer.getData('noteID'), this.props.note.id);
        event.preventDefault();
    }

    onDrop(event) {
        this.setState({ dragging: false });
        event.preventDefault();
    }

    render() {
        let className = "note-item-container";
        className += (this.props.note.complete) ? " note-item-container-complete" : "";
        className += (!this.state.editing) ? " note-item-container-noedit" : "";

        return (
            <div
                draggable={!this.state.editing}
                className={className}
                onDragStart={this.onDragStart}
                onDragOver={this.onDragOver}
                onDrop={ev => this.setState({ dragging: false })}
                onDragExitCapture={ev => this.setState({ dragging: false })}>
                <div hidden={this.state.editing} className={(this.props.note.complete) ? "note-item-content note-item-complete" : "note-item-content"}>
                    <div><strong><u>{this.props.note.title}</u></strong></div>
                    <Markdown>{this.props.note.body}</Markdown>
                    <div className="note-item-tags">{this.props.note.tags ? tagsToString(this.props.note.tags) : ""}</div>
                </div>
                <div hidden={!this.state.editing} className={"note-item-content"}>
                    <input type="text" className="note-item-input" value={this.state.editTitle} onChange={ev => this.setState({ editTitle: ev.currentTarget.value })} />
                    <textarea maxLength={200} type="text" className="note-item-input" value={this.state.editBody} onChange={ev => this.setState({ editBody: ev.currentTarget.value })} />
                </div>
                <div hidden={this.state.editing} className="note-item-controls">
                    <button className="btn" onClick={this.delete}>✖</button>
                    <button className="btn" hidden={this.state.editing} onClick={this.toggleEdit} style={{ transform: 'scale(-1, 1)' }}>✎</button>
                    <button className="btn" hidden={!this.state.editing} onClick={this.toggleEdit}>✔</button>
                    <button className="btn" onClick={this.tag} style={{ transform: 'rotate(30deg) scale(0.8, 1.2) ' }}>⛊</button>
                    <button className="btn" onClick={this.complete}>{this.props.note.complete ? `☑` : `☐`}</button>
                </div>
            </div>
        );
    }
}

export default hot(module)(NoteItem);