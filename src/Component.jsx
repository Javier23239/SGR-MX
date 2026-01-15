import { useState } from "react"

export default function Component() {

    const [text, setText] = useState()
    const textOnchange = (event) => {
        setText(event.target.value)
    }

    return (
    <div>
        <input type="text" value={text} onChange={textOnchange} />
        <button>Actualizar</button>
        <p>Texto: {text}</p>
        <p>Texto Actualizado</p>


    </div>
  )
}
