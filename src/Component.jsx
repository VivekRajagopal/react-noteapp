class EditableLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {            
            editing: false,
            savedValue: this.props.value,
            editValue: this.props.value     //Temporary value displayed to user when editing label
        }
    }

    componentDidUpdate() {
        if (this.inputElem)
            this.inputElem.focus();
    }

    edit = () => {
        this.setState({editing: true});
        this.props.editNotify(true);
    }

    cancel = () => {
        this.setState({editing: false});
        this.setState({editValue: this.state.savedValue});
        this.props.editNotify(false);
        console.log(`Note ID:${this.props.id} edit cancelled`)
    }

    //Commits the text-input value to the note label value
    save = () => {
        this.setState({editing: false});
        this.props.editNotify(false);
        if (this.state.editValue == this.state.savedValue || this.state.editValue == "") this.cancel();
        else {
            this.setState({savedValue: this.state.editValue});
            this.props.changeNotify(this.props.id, this.state.editValue);
        }        
    }

    keyHandle = (ev) => {
        switch (ev.key) {
            case 'Enter':
                this.save();
                break;
            case 'Escape':
                this.cancel();
                break;
        }
    }

    render() {
        let labelElem = <label 
            className="label-editable"
            onClick={this.edit}>{this.state.editValue}</label>

        let inputElem = <input 
            type="text"
            value={this.state.editValue}
            onChange={(e)=>{this.setState({editValue: e.target.value})}}
            onBlur={this.save}
            onKeyDown={this.keyHandle}
            ref={(i)=>{this.inputElem=i}}></input>

        let renderedElem = labelElem;
        if (this.state.editing) renderedElem = inputElem

        return (
            renderedElem
        )
    }
}

class MainApp extends React.Component {
    constructor() {
        super();

        let LSItems = JSON.parse(window.localStorage.getItem("listItems"));        

        if (!LSItems || LSItems === {}) LSItems = [
            [0, "Hello"],
            [1, "World"],
            [2, "Do dishes...?"]
        ];

        this.state = {
            list: new Map(LSItems)
        }

        this.addNoteHandle = this.addNoteHandle.bind(this);
        this.deleteNoteHandle = this.deleteNoteHandle.bind(this);
        this.modifyNoteHandle = this.modifyNoteHandle.bind(this);
        this.reorderNotesHandle = this.reorderNotesHandle.bind(this);
        this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
    }

    addNoteHandle(noteName) {
        let id = Date.now();
        this.state.list.set(id, noteName);
        this.setState(this.state.list);

        this.saveToLocalStorage();
    }

    deleteNoteHandle(noteID)  {  
        this.state.list.delete(noteID)
        this.setState({ list: this.state.list });
        this.saveToLocalStorage();
    }

    modifyNoteHandle(noteID, newVal) {
        this.state.list.set(noteID, newVal);
        this.saveToLocalStorage();
    }

    reorderNotesHandle(IDList) {
        let newEntries = [];
        IDList.forEach((val) => {newEntries.push([val, this.state.list.get(val)])});
        this.setState({list: new Map(newEntries)});
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        window.localStorage.setItem("listItems", JSON.stringify([...this.state.list.entries()]));
    }

    render() {
        return (
            <div className="app-container">
                <h1>React Notes</h1>
                {
                    /* <button className="btn" onClick={()=>{console.log(this.state.list)}}>LOG</button>
                    <button className="btn" onClick={()=>{console.log(window.localStorage.getItem("listItems"))}}>Local Store</button> */
                }
                <p>This is a simple note taking / todo app built with ReactJS. Create notes to start using. You can reorder and delete notes as you wish.</p>
                <AddNote addNote={this.addNoteHandle}/>
                <ItemList list={this.state.list} deleteNote={this.deleteNoteHandle} reorderNotes={this.reorderNotesHandle} modifyNote={this.modifyNoteHandle}/>
                {
                    /* <EditableLabel value="Hello world" id={Date.now()} editNotify={()=>{console.log('Edit notification')}} changeNotify={(id, val)=>{console.log(`Note ID:${id} edited to ${val}`)}}/> */
                }
            </div>
        );
    }
}
