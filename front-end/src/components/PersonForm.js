const PersonForm = (props) => {
    return (
        <form onSubmit={props.submit}>
            <div>
                {props.textName} <input
                    value={props.nameValue}
                    onChange={props.onChangeName}
                />
            </div>
            <div>
                {props.textNumber} <input
                    value={props.valueNumber}
                    onChange={props.onChangeNum}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm
