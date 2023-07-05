const todos = [ 
    {
        name : '자바스크립트 공부하기', 
        tags : ['programming', 'javascript'],
        status : 'todo',
        id : 12123123
    },
    {
        name : ' 그림 그리기',
        tags : ['picture', 'favorite'],
        status : 'doing',
        id : 312323
    }
];
const currentStatus = {
    todo:0,
    doing:0,
    done:0,
};
const statusName = ["todo","doing","done"];

module.exports = {
    todos,currentStatus,statusName
};