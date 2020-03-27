import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  //console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  console.log({colorToEdit});

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        const newColorArr = colors.map(color => {
          if (color.id === colorToEdit.id) {
            return colorToEdit
          } else {
            return color
          }
        })
        updateColors(newColorArr);
        setEditing(false);
        setColorToEdit(initialColor);
      })
      .catch(err => console.log("Error updating color: ", err))
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then(res => {
        const newColorArr = colors.filter(color => color.id !== res.data);
        updateColors(newColorArr);
      })
      .catch(err => console.log("Error deleting color: ", err))
  };

  const addNewColor = el => {
    const newColor = {
      color: el.color,
      code: el.code,
      id: Date.now()
    }
    console.log({newColor})
    axiosWithAuth()
      .post("/api/colors", newColor)
      .then(res => {
        // console.log(res)
        updateColors(res.data);
      })
      .catch(err => console.log("Error adding color: ", err))
  }

  const newColorHandler = e => {
    e.preventDefault();
    addNewColor(colorToEdit)
    setColorToEdit(initialColor)
}

  return (
    <div className="colors-wrap">
      <p>colors</p>
      {/* stretch - build another form here to add a color */}
      <form onSubmit={newColorHandler}>
          <legend>add color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">add</button>
          </div>
        </form>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
    </div>
  );
};

export default ColorList;
