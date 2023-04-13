const axios = require('axios'); // Подключение модуля axios для скачивания страницы
const fs = require('fs'); 
const jsdom = require("jsdom"); // Подключение модуля jsdom для работы с DOM-деревом (1)
const { JSDOM } = jsdom; // Подключение модуля jsdom для работы с DOM-деревом (2)


const linkArr = [
    'http://bszholding.ru/career/job/1065/', 
    'http://bszholding.ru/career/job/?PAGEN_1=2'
];

const vacancies = [

];

var needle = require('needle');
// using promises

const getInfoFromVac = async (link) => {
    try {
        const resp = await needle('get', link);
        const dom = new JSDOM(resp.body);
       
        return Array.from(dom.window.document.querySelectorAll('p')).map((item, i) => {
            return item.textContent;
        });
    } catch (err) {
    console.error('Произошла ошибка!', err);
  }
}


const getVacs = async () => {
    const resp = await needle('get', 'http://bszholding.ru/career/job/');
    const dom = new JSDOM(resp.body);
    const resp2 = await needle('get', 'http://bszholding.ru/career/job/?PAGEN_1=2');
    const dom2 = new JSDOM(resp2.body);

    return Promise.all(Array.from(dom.window.document.querySelectorAll('.contact')).map((item) =>{
        //console.log(`${item.querySelector('a').href}`);
        //console.log(item.textContent)
        //const info = await getInfoFromVac(`http://bszholding.ru${item.querySelector('a').href}`);
        return getInfoFromVac(`http://bszholding.ru${item.querySelector('a').href}`).then((info) =>{
         return {
            name: item.querySelector('a').textContent,
            hunter: item.querySelector('.comment').textContent,
            link: `${item.querySelector('a').href}`,
            info: info,
        }})
        
    }).concat( 
        Array.from(dom2.window.document.querySelectorAll('.contact')).map((item) =>{
            return getInfoFromVac(`http://bszholding.ru${item.querySelector('a').href}`).then((info) =>{
             return {
                name: item.querySelector('a').textContent,
                hunter: item.querySelector('.comment').textContent,
                link: `${item.querySelector('a').href}`,
                info: info,
            }})
        })
    ));
    
   
}/*
    const resp2 = await needle('get', 'http://bszholding.ru/career/job/?PAGEN_1=2');
    const dom2 = new JSDOM(resp2.body);
    Array.from(dom2.window.document.querySelectorAll('.contact')).map(async (item) =>{
        //console.log(`${item.querySelector('a').href}`);
        //console.log(item.textContent)
        const info =  await getInfoFromVac(`http://bszholding.ru${item.querySelector('a').href}`);
        await vacancies.push({
            name: item.querySelector('a').textContent,
            hunter: item.querySelector('.comment').textContent,
            link: `http://bszholding.ru${item.querySelector('a').href}`,
            info
        });
    });*/
    //console.log(vacancies);
    //console.log(vacancies.length)
//}


const stf =  () =>{
    const aa= []
    getVacs().then((a) =>  {
        console.log(a);
        fs.writeFileSync('output.txt', JSON.stringify(a));
    });
    
}

stf();
/*
getVacs();
/*

needle('get', 'http://bszholding.ru/career/job/')
  .then( async function(resp) {
    const dom = new JSDOM(resp.body);
    Array.from(dom.window.document.querySelectorAll('.contact')).map(item =>{
        console.log(`${item.querySelector('a').href}`);
        console.log(item.textContent)

        await needle('get', `http://bszholding.ru${`${item.querySelector('a').href}`}`)
        .then(function(resp){
            const dom = new JSDOM(resp.body);
            Array.from(dom.window.document.querySelectorAll('p')).map(item =>{
                console.log(item.textContent);
            });
        })

    })
  })
  .catch(function(err) {
    // ...
  });*/
