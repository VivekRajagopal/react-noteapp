import React, { Component } from 'react';

class NotesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: undefined,
            editing: false
        }
        this.labelChangeNotify = this.labelChangeNotify.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
    }

    //Notify MainApp of note label change
    labelChangeNotify(noteID, editValue) {
        this.setState({editing: false});
        this.props.modifyNote(noteID, editValue);
    }

    //Get source of drag operation
    dragStart(ev) {
        this.dragSource = Number(ev.currentTarget.dataset.id);
        this.setState({ dragging: this.dragSource });
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.mozCursor = 'grabbing';
        // Firefox requires calling dataTransfer.setData for the drag to properly work
        ev.dataTransfer.setData("text/html", null);
    }

    //Resort item array to insert dragSource into dragOverTarget
    dragOver(ev) {
        ev.preventDefault();
        const items = [...this.props.list.entries()].map((entry)=>{return entry[0]});   //Get array of note IDs                
        let dragTarget = Number(ev.currentTarget.dataset.id);   //ID of note being dragged over
        if (dragTarget == this.dragSource) return;              //Exit if reorder not required
        
        //Reposition 
        let iDragSource = items.indexOf(this.dragSource);
        let iDragTarget = items.indexOf(dragTarget);
        let dtItem = items.splice(iDragSource, 1)[0];   //Remove dragTarget item
        items.splice(iDragTarget, 0, dtItem);    //Insert dt at dropTarget location
        
        this.setState({ dragging: dragTarget });
        this.props.reorderNotes(items);
    }

    dragLeave(ev) {
        //ev.preventDefault();
        this.setState({ dragging: undefined })
    }

    dragEnd(ev) {
        //ev.preventDefault();
        this.setState({ dragging: undefined })
    }

    renderNoteItem(noteName, noteID) {
        ///const style = (noteID === this.state.dragSource) ? "note-item-container note-item-droptarget" : "note-item-container";
        return (
            <div className="note-item-container"
                data-id={noteID}
                key={noteID}                
                draggable ={!this.state.editing}
                onDragStart={this.dragStart}
                onDragOver={this.dragOver}
                onDragLeave={this.dragLeave}
                onDragEnd={this.dragEnd}
                onBlur={this.dragEnd}
            >   
                <EditableLabel 
                    value={noteName} 
                    id={noteID} 
                    editNotify={(edit)=>this.setState({editing: edit})}
                    changeNotify={this.labelChangeNotify}/>
                <button className="btn btn-delete"
                    onClick={(e) => this.props.deleteNote(noteID)}>
                    <i className="fa fa-trash"></i>
                </button>
            </div>
        )
    }

    render() {
        let noteElems = [];
        this.props.list.forEach((val, key)=>{
            noteElems.push(this.renderNoteItem(val, key))
        })

        if (noteElems.length == 0) noteElems.push(<div key={0} className="note-list-noitems">Add some notes to get started!</div>)

        return (
            <div className="note-list-container">
                {noteElems}
            </div>
        );
    }
}

export default NotesList;