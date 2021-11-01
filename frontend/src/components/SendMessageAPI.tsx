const SendMessageAPI = () => {

    const buttonClick = async() => {
        console.log("This is a button click");

        const response = await fetch('http://localhost:8000/api/test');
        const data = await response.json();
        console.log(data.text);

    }

    return (
        <div>
            <input type="text" />
            <button type="button" onClick={buttonClick}> Send </button>
        </div>
    )
}

export default SendMessageAPI 