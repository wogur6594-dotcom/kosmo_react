import {useEffect, useState} from "react";


function Test() {
    const[count, setCount]=useState(1)

    useEffect(() => {
        console.log('use effect 실행');
    }, [count]);


    function fn(){
    console.log("click");
    setCount(count+1);
}
    return (
        <>
        <h3>Test Page</h3>
        <button onClick={fn}>Click</button>
        <div>{count}</div>
        </>
    )
}
export default Test;