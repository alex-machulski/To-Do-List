import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormType = {
    addItem: (title: string) => void
}

function AddItemForm(props: AddItemFormType) {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null)

    const addItem = () => {
        const itemTitle = title.trim();
        if (itemTitle) {
            props.addItem(itemTitle);
        } else {
            setError("Title is required!");
        }
        setTitle("");
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(null);
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") addItem()
    }

    return (
        <div>
            <TextField
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                helperText={error} label={"New Title"}/>
            <IconButton color={"primary"} onClick={addItem}>
                <AddBox/>
            </IconButton>
            {/*{error && <div className={"error-message"}>{error}</div>}*/}
        </div>
    )
}

export default AddItemForm;