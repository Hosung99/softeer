const gradeItem = require('./gradeItem');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const todos = gradeItem.todos;
const currentStatus = gradeItem.currentStatus;
const statusName = gradeItem.statusName;

function initCurrentStatus(){
    todos.map((value) => {
        for (const key in currentStatus){
            if (value.status == key)
                currentStatus[key] += 1;
        }
    });
}

function printCurrentStatus(){
    console.log(`현재상태 : todo: ${currentStatus.todo}개, doing:${currentStatus.doing}개, done:${currentStatus.done}개`);
}

function show(argv2){
    if(argv2 === "all")
        printCurrentStatus();
    else
        showStatus(argv2);
}

function showStatus(argv2){
    if (!statusName.includes(argv2))
         console.log("상태를 잘못 입력하셨습니다!");
    else{
        let argv2Count = currentStatus[argv2];
        let answer = `${argv2}리스트: 총 ${argv2Count}건 : `;
        todos.forEach((value) => {
            if(value.status === argv2)
                answer += `' ${value.name}, ${value.id}', `;
        });
        answer = answer.substring(0,answer.length-2);
        console.log(answer);
    }
}

function add(argv2, argv3){
    if (todos.length === 100000000)
        console.log("꽉 차서 add가 불가능합니다.");
    else{
        todos.push(makeTempObject(argv2,argv3));
        currentStatus.todo++;
        printCurrentStatus();
    }
}

function makeTempObject(argv2,argv3){
    let randomId = generateId();
    let tempArray = argv3.replace("[", "").replace("]", "").replace(/"/gi, "").split(',');
    let tempObject={
        name:argv2,
        tags:tempArray,
        status:'todo',
        id:randomId
    };
    console.log(`${argv2} 1개가 추가 됐습니다. (id : ${randomId})`);
    return tempObject;
}

function generateId(){
    let randomId = parseInt(Math.random()*100000000);
    let dupflag = 0;
    do
    {
        for (let todo of todos){
            if (todo.id === randomId)
            {
                randomId = parseInt(Math.random()*100000000);
                dupflag = 1;
                break;
            }
            else
                dupflag = 0;
        }
    }while(dupflag);
    return randomId;
}

function deleteItem(argv2){
    if (todos.length === 0)
        console.log("todo-list가 비어있습니다.");
    else{
        doDelte(argv2, checkId(argv2));
        printCurrentStatus();
    }
}

function checkId(argv2){
    if (argv2[0] == '[' && argv2.at(-1) == ']')
        return 'Tag';
    else if(!isNaN(argv2))
        return 'Id';
    else
        return 'Error';
}

function doDelte(argv2, checkId){
    if (checkId === 'Id')
        deleteUsingId(argv2);
    else if (checkId === 'Tag')
        deleteUsingTag(argv2);
    else
        console.log("잘못입력하셨습니다.");
}

function deleteUsingId(argv2){
    let existFlag = 1;
    todos.forEach((todo,index)=>{
        if(argv2 == todo.id)
            existFlag = deleteStatus(todo, index);
    });
    if (existFlag)
        console.log("없는 아이디입니다.");
}

function deleteUsingTag(argv2){
    //추가 기능 : 만약 ["a","b"]로 들어오면 정확히 a,b가 들어간 태그만 삭제하고싶으면??
    let existFlag = 1;
    let tempArray = argv2.replace("[", "").replace("]", "").replace(/"/gi, "").split(',');
    tempArray.forEach((value)=>{
        todos.forEach((todo)=>{
            todo.tags.forEach((tag,index)=>{
                if (tag == value)
                    existFlag = deleteStatus(todo, index);
            });
        });
    });
    if (existFlag)
        console.log("없는 태그 입니다.");
}

function deleteStatus(todo, index){
    console.log(`${todo.name} ${todo.status}가 목록에서 삭제됐습니다`);
    currentStatus[todo.status]--;
    todos.splice(index,1);
    return 0;
}

function update(argv2,argv3){
    if (!statusName.includes(argv3))
        console.log("상태를 잘못 입력하셨습니다!");
    else{
        if (doUpdate(argv2,argv3))
            console.log("없는 아이디 입니다.");
        printCurrentStatus();
    }
}

function doUpdate(argv2,argv3){
    let existFlag = 1;
    todos.forEach((todo,index)=>{
        if(argv2 === todo.id)
        {
            console.log(`${todo.name} ${argv3}으로 상태가 변경됐습니다`);
            currentStatus[todo.status]--;
            todos[index].status = argv3;
            currentStatus[todo.status]++;
            existFlag = 0;
        }
    });
    return existFlag;
}

function clear(){
    todos.splice(0);
    for(const key in currentStatus)
        currentStatus[key] = 0;
    console.log("초기화 했습니다.");
    printCurrentStatus();
}

function excute(){
    rl.question("명령하세요 : ", (line) => {
    let [argv1, argv2, argv3] = line.split("$");
        if(argv1 === "show" )
            show(argv2);
        else if (argv1 === "add")
            add(argv2,argv3);
        else if (argv1 === "delete")
            deleteItem(argv2);
        else if (argv1 === "update")
            update(argv2,argv3);
        else if (argv1 === "clear")
            clear();
        else
            rl.close();
    excute();
    });
    rl.on('close', () => {
        console.log("잘못입력하셔서 종료합니다.");
        process.exit();
    });
};

initCurrentStatus();
excute();