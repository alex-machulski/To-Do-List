import React, {ChangeEvent, useState, KeyboardEvent} from "react";


type EditableSpanType = {
    title: string
    changeTitle: (newTitle: string) => void
}


function EditableSpan(props: EditableSpanType) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.title)
    const onEditMode = () => setEditMode(true);
    const offEditMode = () => {
        setEditMode(false);
        if(title.trim()) {
            props.changeTitle(title.trim())
        }
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value);

    return (
        editMode
            ? <input
                onBlur={offEditMode}
                autoFocus
                value={title}
                onChange={changeTitle}
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
}

export default EditableSpan;