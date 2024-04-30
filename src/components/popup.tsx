export default function Popup({ content, type, setter }: { content: string, type: PopupType, setter: Function }) {

    const container: HTMLElement | null = document.getElementById("container");

    if (type === null) {
        if (container) container.style.filter = "blur(0px)";
        return (<></>);
    }

    if (container) container.style.filter = "blur(5px)";

    return (
        <div id="popup">
            <form onSubmit={e => e.preventDefault()}>
                <h2>Popup</h2>
                <p>{content}</p>
                {type === "textInput" && <input type="text" placeholder="Enter text here" onChange={e => {
                    
                }}/>}
                {type === "textInput" && <button onClick={() => {
                    setter({content: "", type: null});
                }}>Ok</button>}
            </form>
        </div>
    )
}