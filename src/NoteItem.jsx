import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import './NoteItem.css';

class NoteItem extends Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            dragging: false
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.complete = this.complete.bind(this);
        this.delete = this.delete.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    //Wip
    toggleEdit(event) {
        event.stopPropagation();
        this.setState({ editing: !this.state.editing });
        event.currentTarget.select();
    }

    complete(event) {
        event.stopPropagation();
        this.props.completeNote(this.props.note.id);
    }

    delete(event) {
        event.stopPropagation();
        this.props.deleteNote(this.props.note.id);
    }

    onDragStart(event) {
        this.setState({dragging: true})
        event.dataTransfer.setData('noteID', this.props.note.id);
    }

    onDragOver(event) {
        this.props.reorderNote(event.dataTransfer.getData('noteID'),this.props.note.id);
        event.preventDefault();
    }

    onDrop(event) {
        this.setState({dragging: false});
        event.preventDefault();
    }

    render() {
        let className = "note-item-container";
        className += (this.props.note.complete) ? " note-item-container-complete" : "";
        //className += (this.state.dragging) ? " note-item-container-dragging" : "";

        return (
            <div
                draggable
                className={className}
                onDragStart={this.onDragStart}
                onDragOver={this.onDragOver}
                onDrop={ev => this.setState({dragging: false})}
                onDragExitCapture={ev => this.setState({dragging: false})}>
                <div
                    className={(this.props.note.complete) ? "note-item-content note-item-complete" : "note-item-content"}>
                    <div><strong>{this.props.note.title}</strong></div>
                    <span>{this.props.note.body}</span>
                </div>
                <div className="note-item-controls">
                    <button className="btn" onClick={this.delete}>✖</button>
                    <button className="btn" onClick={this.complete}>{this.props.note.complete ? `☑` : `☐`}</button>
                </div>
            </div>
        );
    }
}

export default NoteItem;