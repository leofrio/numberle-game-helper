var globalAddedInputs=[];
var globalNotInputs=[]; 
var possibleNum=["1","2","3","4","5","6","7","8","9","0"]
var possibleSigns=["+","-","/","*","="]
function doit() { 
    possibleNum=["1","2","3","4","5","6","7","8","9","0"]
    possibleSigns=["+","-","/","*"]
    var hasn= document.getElementById("hasn").value
    var notn=document.getElementById("notn").value 
    var nlen=parseInt(document.getElementById("nlen").value)   
    var result =document.getElementById("result") 
    var end=false 
    var mustHaveInPos=[] 
    var mustNotHaveInPos=[] 
    for(var i=0;i < nlen;i++) { 
        mustHaveInPos.push(undefined) 
        mustNotHaveInPos.push([])
    }
    var mustHave=[]
    if(hasn != "" ) { 
        var nums=hasn.split(",") 
        for(o of nums) { 
            mustHave.push(o)
        }
    }
    if(notn != "" ) { 
        var nums=notn.split(",") 
        for(o of nums) { 
            indexNum=possibleNum.indexOf(o) 
            indexSign=possibleSigns.indexOf(o)  
            if(indexNum != -1) {
                possibleNum.splice(indexNum,1) 
            } 
            if(indexSign != -1) { 
                possibleSigns.splice(indexSign,1)
            }
        }
    }  
    if(!isEmpty(globalAddedInputs)) { 
        var i=0
        for(data of globalAddedInputs) { 
            if(i<10) {
                var current=document.getElementById(data).value   
                if(current != "") {     
                    var currentPos=parseInt(data.charAt(data.length-1)) 
                    mustHaveInPos[currentPos]=current
                }  
            } 
            else { 
                var current=document.getElementById(data).value   
                if(current != "") {     
                    var currentPos=parseInt(data.charAt(data.length-2) + data.charAt(data.length-1)) 
                    mustHaveInPos[currentPos]=current
                }  
            }
            i++
        } 
            
    } 
    if(!isEmpty(globalNotInputs)) { 
            var i=0
            for(data of globalNotInputs) { 
                var current=document.getElementById(data).value    
                if(current != "") { 
                    var numbers=current.split(",")
                    var currentPos= (i > 9) ? parseInt(data.charAt(data.length-2) + data.charAt(data.length-1)) : parseInt(data.charAt(data.length-1))  
                    for(let i=0;i< numbers.length;i++) { 
                          mustNotHaveInPos[currentPos].push(numbers[i])
                    }
                } 
                i++
            } 
    } 
    if(!isNaN(nlen)) {   
        while(!end) { 
            var generateword=""      
            var mustBeInPos=mustHaveInPos.map((o,index) => { 
                if(o != undefined) {
                    return index
                } 
                else {
                    return undefined
                }
            }).filter((o,i) => { 
                if(o == undefined) { 
                    return false
                } 
                else { 
                    return true 
                }
            }) 
            var mustNotBeInPos=mustNotHaveInPos.map((o,index)=> { 
                if(!isEmpty(o)) { 
                    return index
                } 
                else {
                    return NaN
                }
            }).filter((o,i) => { 
                if(isNaN(o)) { 
                    return false
                } 
                else { 
                    return true 
                }
            })
            var equalPos=(mustHaveInPos.includes("=")) ? mustHaveInPos.indexOf("=") : Math.floor(Math.random() *nlen) 
            var signAmount= (nlen >= 7) ? Math.floor(Math.random() *2) +1 : 1 
            var signPos1=Math.floor(Math.random() *nlen)  
            var signPos2=(signAmount >1) ? Math.floor(Math.random() *nlen) : -1 
            if(equalPos <= Math.floor(nlen/3) || equalPos == nlen-1 
            || signPos1 >= nlen-2 || signPos1 ==0 || signPos2 >= nlen-2 || signPos2 == 0 
            || signPos1 == signPos2|| signPos1 == equalPos || signPos2 ==equalPos) { 
                continue        
            }
            for(var i=0;i<nlen;){  
                var auxStopper=false 
                for(var j=0;j< mustBeInPos.length;j++) {
                    if(i == mustBeInPos[j]) { 
                        generateword += mustHaveInPos[i] 
                        auxStopper=true 
                        break
                    } 
                }  
                if(auxStopper) { 
                    i++ 
                    continue
                } 
                if(i == 0 || i == nlen-1) {
                    var randomizer=Math.floor(Math.random() * possibleNum.length)
                    generateword += possibleNum[randomizer] 
                } 
                else { 
                    if(i == equalPos) { 
                        generateword += "="
                    } 
                    else { 
                        if(i ==signPos1) { 
                            var randomizer=Math.floor(Math.random() * possibleSigns.length) 
                            generateword += possibleSigns[randomizer]
                        } 
                        else { 
                            if(signPos2 != -1) { 
                                if(i== signPos2) { 
                                    var randomizer=Math.floor(Math.random() * possibleSigns.length) 
                                    generateword += possibleSigns[randomizer]
                                } 
                                else { 
                                    var randomizer=Math.floor(Math.random() * possibleNum.length)
                                    generateword += possibleNum[randomizer] 
                                }
                            } 
                            else {
                                var randomizer=Math.floor(Math.random() * possibleNum.length)
                                generateword += possibleNum[randomizer] 
                            }
                        }
                    }
                } 
                i++
            }   
            signAmount=signsCounterLeft(generateword)
            var counter=0 
            for(var i=0;i< mustHave.length;i++) { 
                if(generateword.split("").includes(mustHave[i])) { 
                    counter++ 
                }
            } 
            if(counter != mustHave.length) { 
                continue
            }  
            var stopper1=false  
            var stopper2=false  
            for(var i=0;i < mustNotBeInPos.length;i++) { 
                for(var j=0;j< mustNotHaveInPos[mustNotBeInPos[i]].length;j++) {
                    if(generateword.charAt(mustNotBeInPos[i]) == mustNotHaveInPos[mustNotBeInPos[i]][j]) { 
                        stopper2=true; 
                        break
                    } 
                }
                if(stopper2) {
                    stopper1=true
                    break;
                } 
            }  
            if(stopper1) { 
                continue
            }
            if(validateEquation(generateword,signAmount)) { 
                result.innerHTML=generateword 
                break
            }
        }
    }  
    else {
        alert("put a valid length")
    }

}   
function validateEquation(squabble,signAmount) { 
    var format=checkIfTangible(squabble) 
    if(!format) { 
        return false 
    }  
    var mathable=isValidResult(squabble,signAmount)
    if(!mathable) { 
        return false
    }
    return true
} 
//here we do some math to check if the equation generated is actualy valid like the signs actually equal to one another 
function isValidResult(squabble,signAmount) {   
    var firstDivision=squabble.split("=")  
    var oneSided=true  
    if(firstDivision[1].split("").includes("*") || firstDivision[1].split("").includes("/") || 
    firstDivision[1].split("").includes("+") ||firstDivision[1].split("").includes("-") ) { 
        oneSided=false
    }
    var equationResult= oneSided ? parseInt(firstDivision[1]) : twosides(firstDivision[1])  
    var finaloperand
    var equationOperand=firstDivision[0]  
    if(equationOperand.split("").includes("*")) {  
        //6    *      3 * 3=18
        var secondDivision=equationOperand.leoSplit("*",1) 
        if(signAmount > 1) {  
            //i labeled the first second and third to match the example 
            if(signAmount >2 ) { 
                finaloperand=bigEquationOpe(equationOperand,"*")
                if(finaloperand == equationOperand) { 
                    return true 
                } 
                else { 
                    return false
                }
            } 
            for(var i=0;i < secondDivision.length;i++) { 
                if(secondDivision[i].split("").includes("*")) { 
                   if(i ==0) {  
                    //ex:3*3*4=36
                    var thirdDivision=secondDivision[i].split("*") 
                    var first=parseInt(thirdDivision[0]) 
                    var second=parseInt(thirdDivision[1]) 
                    var third=parseInt(secondDivision[1])
                    finaloperand=first*second*third 
                    if(finaloperand == equationResult) {
                        return true
                    } 
                    else { 
                        return false
                    }
                   } else { 
                    //ex:3*3*4=36
                    var thirdDivision=secondDivision[i].split("*") 
                    var first=parseInt(thirdDivision[0]) 
                    var second=parseInt(thirdDivision[1]) 
                    var third=parseInt(secondDivision[0])
                    finaloperand=first*second*third 
                    if(finaloperand == equationResult) {
                        return true
                    } 
                    else { 
                        return false
                    }
                   }
                } else if(secondDivision[i].split("").includes("/")) { 
                    if(i ==0) {  
                        //ex:3/3*4=4
                        var thirdDivision=secondDivision[i].split("/") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=(first/second)*third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3*3/3=3
                        var thirdDivision=secondDivision[i].split("/") 
                        var first=parseInt(secondDivision[0]) 
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=(first*second)/third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }

                } else if(secondDivision[i].split("").includes("+")) { 
                    if(i ==0) {  
                        //ex:3+3*4=15
                        var thirdDivision=secondDivision[i].split("+") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=first+(second*third) 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3*3+3=12
                        var thirdDivision=secondDivision[i].split("+") 
                        var first=parseInt(secondDivision[0])
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=(first*second)+third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }

                } else if(secondDivision[i].split("").includes("-")) { 
                    if(i ==0) {  
                        //ex:3-3*4=0
                        var thirdDivision=secondDivision[i].split("-") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=first-(second*third) 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3*3-3=0
                        var thirdDivision=secondDivision[i].split("-") 
                        var first=parseInt(secondDivision[0])
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=(first*second)-third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }
                }
            }
        } 
        else {  
            var first=parseInt(secondDivision[0]) 
            var second=parseInt(secondDivision[1]) 
            if((first*second) == equationResult) { 
                return true
            } 
            else {
                return false
            }
        }
    } else if(equationOperand.split("").includes("/")) { 
        var secondDivision=equationOperand.leoSplit("/",1)
        if(signAmount > 1) {  
            //i labeled the first second and third to match the example
            
            if(signAmount >2 ) { 
                finaloperand=bigEquationOpe(equationOperand,"/")
                if(finaloperand == equationOperand) { 
                    return true 
                } 
                else { 
                    return false
                }
            }
            for(var i=0;i < secondDivision.length;i++) { 
                if(secondDivision[i].split("").includes("/")) { 
                    if(i ==0) {  
                        //ex:3/3/4=0.25
                        var thirdDivision=secondDivision[i].split("/") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=(first/second)/third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3/3/3=0.33
                        var thirdDivision=secondDivision[i].split("/") 
                        var first=parseInt(secondDivision[0]) 
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=(second/third)/first 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }

                } else if(secondDivision[i].split("").includes("+")) { 
                    if(i ==0) {  
                        //ex:3+8/4=5
                        var thirdDivision=secondDivision[i].split("+") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=first+(second/third) 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3/3+3=12
                        var thirdDivision=secondDivision[i].split("+") 
                        var first=parseInt(secondDivision[0])
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=(first/second)+third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }

                } else if(secondDivision[i].split("").includes("-")) { 
                    if(i ==0) {  
                        //ex:3-3/4=0
                        var thirdDivision=secondDivision[i].split("-") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=first-(second/third) 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3/3-3=0
                        var thirdDivision=secondDivision[i].split("-") 
                        var first=parseInt(secondDivision[0])
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=(first/second)-third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }
                }
            }
        }
        else {  
            var first=parseInt(secondDivision[0]) 
            var second=parseInt(secondDivision[1]) 
            if((first/second) == equationResult) { 
                return true
            } 
            else {
                return false
            }
        }
    } else if(equationOperand.split("").includes("+")) { 
        var secondDivision=equationOperand.leoSplit("+",1)
        if(signAmount > 1) {  
            //i labeled the first second and third to match the example
            if(signAmount >2 ) { 
                finaloperand=bigEquationOpe(equationOperand,"+")
                if(finaloperand == equationOperand) { 
                    return true 
                } 
                else { 
                    return false
                }
            }
            for(var i=0;i < secondDivision.length;i++) { 
                if(secondDivision[i].split("").includes("+")) { 
                    if(i ==0) {  
                        //ex:3+3+4=10
                        var thirdDivision=secondDivision[i].split("+") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=first+second+third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3+3+3=9
                        var thirdDivision=secondDivision[i].split("+") 
                        var first=parseInt(secondDivision[0])
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=first+second+third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }

                } else if(secondDivision[i].split("").includes("-")) { 
                    if(i ==0) {  
                        //ex:3-3+4=0
                        var thirdDivision=secondDivision[i].split("-") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=first-second+third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3+3-3=0
                        var thirdDivision=secondDivision[i].split("-") 
                        var first=parseInt(secondDivision[0])
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=first+second-third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }
                }
            }
        }
        else {  
            var first=parseInt(secondDivision[0]) 
            var second=parseInt(secondDivision[1]) 
            if((first+second) == equationResult) { 
                return true
            } 
            else {
                return false
            }
        }
    } else if(equationOperand.split("").includes("-")) { 
        var secondDivision=equationOperand.leoSplit("-",1)
        if(signAmount > 1) {  
            //i labeled the first second and third to match the example
            if(signAmount >2 ) { 
                finaloperand=bigEquationOpe(equationOperand,"-")
                if(finaloperand == equationOperand) { 
                    return true 
                } 
                else { 
                    return false
                }
            }
            for(var i=0;i < secondDivision.length;i++) { 
                if(secondDivision[i].split("").includes("-")) { 
                    if(i ==0) {  
                        //ex:3-3-4=0
                        var thirdDivision=secondDivision[i].split("-") 
                        var first=parseInt(thirdDivision[0]) 
                        var second=parseInt(thirdDivision[1]) 
                        var third=parseInt(secondDivision[1])
                        finaloperand=   first-second-third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       } else { 
                        //ex:3-3-3=0
                        var thirdDivision=secondDivision[i].split("-") 
                        var first=parseInt(secondDivision[0])
                        var second=parseInt(thirdDivision[0]) 
                        var third=parseInt(thirdDivision[1])
                        finaloperand=(first-second)-third 
                        if(finaloperand == equationResult) {
                            return true
                        } 
                        else { 
                            return false
                        }
                       }
                }
            }
        }
        else {  
            var first=parseInt(secondDivision[0]) 
            var second=parseInt(secondDivision[1]) 
            if((first-second) == equationResult) { 
                return true
            } 
            else {
                return false
            }
        }
    }
}
//here i check if it has at least one opeartion sign and one equal sign
function checkIfTangible(squabble) { 
    var noEqual=true 
    var noSign=true
    for(var i=0;i< squabble.length;i++) { 
        if(squabble.charAt(i) == "=") { 
            noEqual=false   
            if(!OnlyNumbersAreNextToSign(squabble,i)) { 
                return false
            }
        }  
        if(squabble.charAt(i) == "+" ||squabble.charAt(i) == "-" ||squabble.charAt(i) == "*" ||squabble.charAt(i) == "/" ) { 
            noSign=false 
            if(!OnlyNumbersAreNextToSign(squabble,i)) { 
                return false
            }
        }
    } 
    if(noEqual || noSign) { 
        return false
    } 
    else { 
        return true
    }
}
//here i check to see if theres only number next to the signs 
function OnlyNumbersAreNextToSign(squabble,signPos) { 
    if(signPos == squabble.length-1) { 
        return false
    }   else if(signPos == 0) { 
        return false
    }  
    else {
        var prevPos=signPos-1 
        var nextPos=signPos+1 
        if(squabble.charAt(prevPos) == "+" || squabble.charAt(prevPos) == "-" ||squabble.charAt(prevPos) == "*" ||squabble.charAt(prevPos) == "/" ||squabble.charAt(nextPos) == "+" ||squabble.charAt(nextPos) == "-" ||squabble.charAt(nextPos) == "*" ||squabble.charAt(nextPos) == "/") { 
            return false
        } 
        else { 
            return true
        }
    }
}

//thgis is just to create the new pos inputs
window.onload=function(){
    var wlenGlobal=document.getElementById("nlen")
    var prevnum=0 
    var previnputarray =[] 
    var inputs= document.getElementById("inputsdiv");  
    //makes an array that saves all the  id of the inputs we will create
    //and removes and adds them as we type
    wlenGlobal.addEventListener("input",function() { 
        var num=parseInt(wlenGlobal.value)  
        if(!isNaN(num)) {  
            if(num != prevnum) { 
                for(var i=0;i < prevnum*2;i++) { 
                    var oldinput=document.getElementById(previnputarray[i]) 
                    oldinput.remove();
                } 
                var idpos=0
                prevnum=num  
                var inputIdArray=[] 
                for(var i=0;i < num *2;i++) { 
                    if(i < num) {
                        var newinput=document.createElement("input") 
                        newinput.id="numinpos" + idpos 
                        newinput.placeholder="num is in pos " +idpos
                        idpos++
                        inputIdArray.push(newinput.id) 
                        inputs.appendChild(newinput) 
                    } 
                    else { 
                        var newinput=document.createElement("input") 
                        newinput.id="numNotInPos" + (idpos-num) 
                        newinput.placeholder="num is not in pos " +(idpos-num)
                        idpos++
                        inputIdArray.push(newinput.id) 
                        inputs.appendChild(newinput) 
                    }
                }  
                previnputarray=inputIdArray; 
                globalAddedInputs=inputIdArray.slice(0,num) 
                globalNotInputs=inputIdArray.slice(num,inputIdArray.length)
            }
        } 
        else { 
            for(var i=0;i < prevnum*2;i++) {
                var oldinput=document.getElementById(previnputarray[i]) 
                oldinput.remove();
            } 
            prevnum=0; 
            previnputarray =[]  
            globalAddedInputs=[]
            globalNotInputs=[]
        }
    })
}  
function signsCounterLeft(squabble) { 
    var countingArea=squabble.split("=")[0]
    var counter=0
    for(var i=0;i< countingArea.length;i++) { 
        if(countingArea.charAt(i) == "+" || countingArea.charAt(i) == "-" ||countingArea.charAt(i) == "*" ||countingArea.charAt(i) == "/" ) { 
            counter++
        }
    } 
    return counter;
}
function twosides(equationresult) { 
    if(equationresult.split("*").length > 1) { 
        var sides=equationresult.split("*")  
                var side1=sides[0] 
                var side2=equationresult.substring(equationresult.indexOf("*") +1) 
                if(side1.split("").includes("*") ||side1.split("").includes("/") ||side1.split("").includes("+") ||side1.split("").includes("-") ) { 
                    side1=twosides(side1)
                } 
                else  { 
                    side1=parseInt(sides[0])
                }  
                if(side2.split("").includes("*") ||side2.split("").includes("/") ||side2.split("").includes("+") ||side2.split("").includes("-") ) { 
                    side2=twosides(side2)
                }  
                else { 
                    side2=parseInt(sides[1])
                } 
                return side1*side2
    } 
    else { 
        if(equationresult.split("/").length > 1) { 
            var sides=equationresult.split("/")  
            var side1=sides[0] 
            var side2=equationresult.substring(equationresult.indexOf("/") +1) 
            if(side1.split("").includes("*") ||side1.split("").includes("/") ||side1.split("").includes("+") ||side1.split("").includes("-") ) { 
                side1=twosides(side1)
            } 
            else  { 
                side1=parseInt(sides[0])
            }  
            if(side2.split("").includes("*") ||side2.split("").includes("/") ||side2.split("").includes("+") ||side2.split("").includes("-") ) { 
                side2=twosides(side2)
            }  
            else { 
                side2=parseInt(sides[1])
            } 
            return side1/side2
        } 
        else {
            if(equationresult.split("+").length > 1) { 
                var sides=equationresult.split("+")  
                var side1=sides[0] 
                var side2=equationresult.substring(equationresult.indexOf("+") +1) 
                if(side1.split("").includes("*") ||side1.split("").includes("/") ||side1.split("").includes("+") ||side1.split("").includes("-") ) { 
                    side1=twosides(side1)
                } 
                else  { 
                    side1=parseInt(sides[0])
                }  
                if(side2.split("").includes("*") ||side2.split("").includes("/") ||side2.split("").includes("+") ||side2.split("").includes("-") ) { 
                    side2=twosides(side2)
                }  
                else { 
                    side2=parseInt(sides[1])
                } 
                return side1+side2
            } 
            else { 
                if(equationresult.split("-").length > 1) {
                    var sides=equationresult.split("-")  
                    var side1=sides[0] 
                    var side2=equationresult.substring(equationresult.indexOf("-") +1)
                    if(side1.split("").includes("*") ||side1.split("").includes("/") ||side1.split("").includes("+") ||side1.split("").includes("-") ) { 
                        side1=twosides(side1)
                    } 
                    else  { 
                        side1=parseInt(sides[0])
                    }  
                    if(side2.split("").includes("*") ||side2.split("").includes("/") ||side2.split("").includes("+") ||side2.split("").includes("-") ) { 
                        side2=twosides(side2)
                    }  
                    else { 
                        side2=parseInt(sides[1])
                    } 
                    return side1-side2
                }  
                else {
                    return NaN
                }
            }
        }
    }
}
function isEmpty(arr) {
    if(arr.length == 0) { 
        return true;
    } 
    return false;
} 
function isBlank(arr) { 
    if(arr.length== 0) {
        return false;
    } 
    else { 
        var counter=0
        for(var i=0;i<arr.length;i++) {
            if(arr[i] == "") { 
                counter++
            }
        } 
        if(counter == arr.length) {
            return true
        } 
        return false;
    }
}
function notBlankSlots(arr) { 
    var counter=0
        for(var i=0;i<arr.length;i++) {
            if(arr[i] != "") { 
                counter++
            }
        } 
        return counter
} 
function bigEquationOpe(squabble,signToOperate) { 
    var part1=squabble.leoSplit(signToOperate,1)[0] 
    var part2=squabble.leoSplit(signToOperate,1)[1]
    if(countingSymbols(part1) >1 ) { 
        if(part1.split("").includes("*")) { 
            part1=bigEquationOpe(part1,"*")
        } else if(part1.split("").includes("/")) { 
            part1=bigEquationOpe(part1,"/")
        } else if(part1.split("").includes("+")) { 
            part1=bigEquationOpe(part1,"+")
        } else if(part1.split("").includes("-")) { 
            part1=bigEquationOpe(part1,"-")
        }
    }   
    else { 
        part1=parseInt(part1)
    } 
    if(countingSymbols(part2) >1) { 
        if(part2.split("").includes("*")) { 
            part2=bigEquationOpe(part2,"*")
        } else if(part2.split("").includes("/")) { 
            part2=bigEquationOpe(part2,"/")
        } else if(part2.split("").includes("+")) { 
            part2=bigEquationOpe(part2,"+")
        } else if(part2.split("").includes("-")) { 
            part2=bigEquationOpe(part2,"-")
        }
    } 
    else{ 
        part2=parseInt(part2)
    } 
    if(signToOperate == "*") { 
        return part1 *part2
    } else if(signToOperate == "/") {
        return part1/part2 
    } else if(signToOperate == "+") { 
        return part1 + part2
    }else if(signToOperate == "-") { 
        return part1-part2
    }
}
String.prototype.leoSplit=function(object=String,limit) { 
    limit ||=0  
    var word=this.valueOf() 
    var newArr=[] 
    if(limit == 0) { 
        newArr=word.split(object) 
        return newArr
    }   
    else {  
        var index=word.indexOf(object) 
        if(index == word.length-1) { 
            newArr.push(word.substring(0,word.length-1))
            return newArr
        } 
        else { 
            var part1=word.substring(0,index)
            var part2=word.substring(index+1 ,word.length) 
            newArr.push(part1) 
            newArr.push(part2)
            return newArr
        }
    }
}  

function countingSymbols(word) { 
    countingArea=word
    var counter=0
    for(var i=0;i< countingArea.length;i++) { 
        if(countingArea.charAt(i) == "+" || countingArea.charAt(i) == "-" ||countingArea.charAt(i) == "*" ||countingArea.charAt(i) == "/" ) { 
            counter++
        }
    }  
    return counter
}

function removeSymbol(text)
{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[????????]','gi'), 'a');
    text = text.replace(new RegExp('[??????]','gi'), 'e');
    text = text.replace(new RegExp('[??????]','gi'), 'i');
    text = text.replace(new RegExp('[????????]','gi'), 'o');
    text = text.replace(new RegExp('[??????]','gi'), 'u');
    text = text.replace(new RegExp('[??]','gi'), 'c');
    return text;                 
}