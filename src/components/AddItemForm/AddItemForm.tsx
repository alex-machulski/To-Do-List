import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(function({addItem, disabled = false}: AddItemFormPropsType) {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        const itemTitle = title.trim();
        if (itemTitle) {
            addItem(title);
        } else {
            setError("Title is required!");
        }
        setTitle("");
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) setError(null);
        if (e.key === "Enter") addItemHandler();
    }

    return (
        <div>
            <TextField
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                helperText={error}
                label={"New Title"}
                disabled={disabled}
            />
            <IconButton color={"primary"} onClick={addItemHandler} disabled={disabled}>
                <AddBox/>
            </IconButton>
        </div>
    )
})

export default AddItemForm;