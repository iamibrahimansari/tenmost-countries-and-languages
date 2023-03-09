const btns = document.querySelectorAll('.btn');
const mainContent = document.getElementById('main');

const countriesURL = 'https://restcountries.com/v2/all';
const countriesNameAndPopulation = [];
const p2 = document.getElementById('p2');
const getWorldPopulation = data =>{
    let totalPopulation = 0;
    data.forEach(country => totalPopulation += country[1]);
    data.unshift(['World', totalPopulation]);
    data[3][0] = 'USA';
    data[9][0] = 'Russia';
}

const barChartFunc = (data, para) =>{
    p2.textContent = `10 Most ${para} in the world`;
    const newData = data;
    data = data.slice(0, 10);
    mainContent.innerHTML = '';
    [1, 2, 3].forEach(temp =>{
        const div = document.createElement('div');
        data.forEach(data1AndData2 =>{
            const span = document.createElement('span');
            switch(temp){
                case 1:
                    span.textContent = data1AndData2[0];
                    break;
                case 2:
                    if(data[0][0] === 'World'){
                        span.style.width = `${100 * data1AndData2[1] / data[0][1]}%`;
                    }else{
                        span.style.width = `${100 * data1AndData2[1] / newData.length}%`;                        
                    }
                    break;
                case 3:
                    span.textContent = data1AndData2[1];
            }
            div.appendChild(span);
        })
        mainContent.appendChild(div);
        console.log(div);
    })
}

const fetchCountriesData = async () =>{
    try{
        const response = await fetch(countriesURL);
        const responseData = await response.json();
        responseData.forEach(({name, population, languages}) => {
            const langs = [];
            languages.forEach(language => langs.push(language.name));
            countriesNameAndPopulation.push([name, population, langs]);
        })
    }catch(err){
        console.log(err);
    }
    countriesNameAndPopulation.sort((a, b) => b[1] - a[1]);
    const onlyUniqueLanguage = [];
    const allLanguages = [];
    countriesNameAndPopulation.forEach(([_, __, languages]) =>{
        languages.forEach(language =>{
            if(!onlyUniqueLanguage.includes(language)){
                onlyUniqueLanguage.push(language);
            }
            allLanguages.push(language);
        })
    })

    getWorldPopulation(countriesNameAndPopulation);

    const languageAndItsOcurrences = [];

    onlyUniqueLanguage.forEach(lang =>{
        let n = 0;
        allLanguages.forEach(l => {
            if(lang === l){
                n += 1;
            }
        })
        languageAndItsOcurrences.push([lang, n]);
    })
    languageAndItsOcurrences.sort((a, b) => b[1] - a[1]);
    languageAndItsOcurrences.splice(9, 2);
    btns.forEach((btn, index) =>{
        btn.addEventListener('click', event =>{
            if(event.target.innerText === 'POPULATION'){
                barChartFunc(countriesNameAndPopulation, 'populated countries');
            }else{
                barChartFunc(languageAndItsOcurrences, 'Spoken language');
            }
        })
    })
}

fetchCountriesData();