const btn = document.querySelector('.changeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');

btn.addEventListener('click', async() => {
    console.log("clicked");

    const color = chrome.storage.sync.get('color',({color})=>{
        console.log('color: ',color);
    });
    let [tab] = await chrome.tabs.query({active:true,currentWindow:true});

    chrome.scripting.executeScript({
        target: {tabId:tab.id},
        function: pickColor,
    }, async(injectionResult)=>{
        const [data] = injectionResult;
        if(data.result){
            const color = data.result.sRGBHex;
            colorGrid.style.background = color;
            colorValue.innerHTML = color;
            try{
                await navigator.clipboard.writeText(color);
            }
            catch(err){
                console.log(err);
            }
        }
        console.log(injectionResult);
    });
});

async function pickColor(){
    console.log("script working");
    try{
        //Picker
        const eyeDropper = new EyeDropper();
        const selectedColor = await eyeDropper.open();
        return selectedColor;
    }
    catch(err){
        console.log(err);
    }
}