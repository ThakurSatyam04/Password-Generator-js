const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".btn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_-+={[}]|:;"<,>.?/';
// Default values
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strenght circle color to grey

// set password length by dragging the slider

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    // To fill the slider till the pointer
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

const setIndicator = (color)=>{
    indicator.style.backgroundColor = color;
}
setIndicator("#ccc");

const getRandomInteger = (min,max)=>{
    return Math.floor(Math.random() * (max-min)) + min;    
}

const generateRandomNumber = ()=>{
    return getRandomInteger(0,9);
}

// console.log(generateRandomNumber());

const generateLowercase = ()=>{
    return String.fromCharCode(getRandomInteger(97,123));
}

// console.log(generateLowercase());

const generateUppercase = ()=>{
    return String.fromCharCode(getRandomInteger(65,91));
}

// console.log(generateUppercase());

const generateSymbol =()=>{
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}
// console.log(generateSymbol());

// Function to calculate strength

const calStrength = ()=>{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >=6){
            setIndicator("#ff0");
        }
    else {
        setIndicator("#f00");
    }
}

function handleCheckboxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    })
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // navigator.clipboard.writeText returns a promise and we have to wait for the promise to get resolve than only we have to show the msg as copied.
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    //To make span of copied visible
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp
    }
    let str = "";
    array.forEach((el)=>(str += el));
    return str; 
}

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider(); 
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    // Non of the checkbox are selected
    if(checkCount <= 0) return;
    
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // now codes to generate the new password

    // first remove old password
    password = "";

    // Lets put stuff mentioned by checkboxes

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    // Compulsory addition according to the checkboxes
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    // remaining addition of restof the numbers in password
    for(let i=0;i<passwordLength - funcArr.length;i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Suffle the final generated password
    password = shufflePassword(Array.from(password));

    //Show password in UI
    passwordDisplay.value = password;

    // calculate strength
    calStrength();

})




