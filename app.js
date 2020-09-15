$(() => {

    // ---- Classes

    // Coin Class
    class Coin {
        constructor(name, symbol, id, logo, usd, eur, ils, time) {
            this.name = name;
            this.symbol = symbol
            this.id = id;
            this.logo = logo;
            this.usd = usd;
            this.eur = eur;
            this.ils = ils;
            this.time = time;
        }
    }

    // Data for Live Reports Class
    class Data {
        constructor(name) {
            this.type = "spline",
                this.name = name,
                this.showInLegend = true,
                this.dataPoints = []
        }
    }

    // ---- Funcs

    // func: for check if an object is empty
    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    // --UI Funcs

    // UI func: draw card with coin info
    function drawCard({
        name,
        id,
        symbol
    }) {
        $('.home-con').append(`
        <div class="top-div col-12 col-md-5 col-lg-3 p-0 m-0 mt-md-3 mr-2 ml-2 mr-lg-3 ml-lg-3 shadow" id=${symbol}>
        <div class="card bg-dark text-white m-0">
        <div class="coin-card card-body d-flex flex-column justify-content-between" id="${id}">
        <label class="switch position-absolute right">
        <input class='checkbox' id="${id+'-checked'}" type="checkbox">
        <span class="slider round"></span>
        </label>
        <h5 class="coin-title card-title w-75">${name}</h5>
        <h6 class="coin-subt card-subtitle mb-2 text-muted">ID: ${id}</h6>
        <h6 class="coin-subt card-subtitle mb-2 text-muted">Symbol: ${symbol.toUpperCase()}</h6>
        <div class="text-center mt-3">
        <p class = "more-btn btn btn-dark text-center border mb-0">More Info</p>
        </div>
        <div class="coin-info w-100 justify-content-between align-items-center mt-4" style="display: none;"></div>
        </div>
        </div>
        </div>
        `)
    }

    // UI func: load info and html into card
    function loadInfoInHtml(div, coin) {
        div.html(`
        <div class = "coin-logo" ><img src = "${coin.logo}" alt = "no pic here"> </div>
        <div class = "ul currency-list currency-title" >
        <li> USD: </li>
        <li> EUR: </li>
        <li> ILS: </li>
        </div>
        <div class = "ul currency-list currency-nums">
        <li id = "item-usd" >${coin.usd}$</li>
        <li id = "item-eur">${coin.eur}&euro;</li>
        <li id = "item-ils">${coin.ils}&#8362;</li>
        </div>
        `)
    }
    // UI func: show chosen coins list
    function drawDeleteMenu() {
        $('.main').append(`
            <div class="row delete-selection m-auto col-12 col-md-10 p-0 bg-dark shadow-lg d-flex justify-content-between align-items-center">
            <div class="col-6 m-auto text-center mt-3">
            <p class="display-4 mt-3">Oops..</p>
            <h3>You may choose up to 5 coins</h3>
            <h3>Please deselect a coin</h3>
            </div>
            <ul class=" pl-4 pr-4 mt-4 w-100 chosen-list flex-column align-items-center justify-content-evenly" style='display:none'>
            </ul>
            </div>
            `)
    }

    function loadInfoToDeleteMenu(coin) {
        $('.chosen-list').append(`
            <li
            class=" chosen-item mb-2 col-12 d-flex justify-content-between align-items-center" id='${coin.id}'>
            <img src=${coin.logo} alt="">
            <p class="coin-name p-3 mb-1 text-break font-weight-bold">${coin.name}</p>
            <div class="usd d-none d-md-flex flex-column flex-lg-row justify-content-between align-items-center">
            <p class="font-weight-bold">USD: </p>
            <p class="ml-2 usd-num">${coin.usd}$</p>
            </div>
            <div class="eur d-none d-md-flex flex-column flex-lg-row justify-content-between align-items-center">
            <p class="font-weight-bold">EUR: </p>
            <p class="ml-2 eur-num">${coin.eur}&euro;</p>
            </div>
            <div class="ils d-none d-md-flex flex-column flex-lg-row justify-content-between align-items-center">
            <p class="font-weight-bold">ILS: </p>
            <p class="ml-2 ils-num">${coin.ils}&#8362</p>
            </div>
            <label class="switch">
            <input class='checkbox-remove' type="checkbox">
            <span class="slider round"></span>
            </li>
            `)
        $('.checkbox-remove').prop('checked', true)
        $('.checkbox-remove').unbind().click(e => {
            setTimeout(() => {
                let id = $(e.target).parents('.chosen-item')[0].id
                removeCoinFromStorage(id, 'chosenCoinsIds')
                $('.delete-selection').css('display', 'none')
                $('.home-btn').click(() => drawHome())
                $('.report-btn').click(() => showReport())
                $('.about-btn').click(() => showAbout())
                drawHome()
                $('.delete-selection').remove()
            }, 1000)
        })
    }

    // UI func: draw loading screen 
    function drawLoadingScreen(div) {
        $(div).append(`
            <div class="popup-loading d-flex" style='display: none'>
            <img src="coin gif (2).gif">
            <p class="h2 text-light">Loading...</p>
            </div> 
                `)
    }

    // UI func: draw pop-up screen
    function drawPopUpScreen(msg) {
        $('.body-con').append(`
            <div class="pop-up row col-12 d-flex justify-content-center align-items-center">
            <div class="col-8 col-md-4 m-auto bg-dark rounded text-white text-center ">
            <button class="close-pop-up btn btn-dark rounded-circle shadow-sm m-2 position-absolute">X</button>
            <h1 class="display-4" >Oops!</h1>
            <h1>${msg}</h1>
            </div>
            </div>
        `)
        $('.close-pop-up').click(()=>{
            $('.pop-up').fadeOut('slow',()=>{
                $('.pop-up').remove()
            })
        })
    }

    // UI func: load App
    function loadApp() {
        $('.main').html(`<div class="row home-con w-100 p-0 m-0 mt-md-2 justify-content-center align-items-start"></div>`)
        $('.home-con').css('display', 'none')
        drawLoadingScreen('.main')
        $('.popup-loading').fadeIn('slow')
        getAllCoinIds().done((data) => {
            let ids = []
            for (let i = 0; i < 115; i++) {
                let id = data[i].id
                let name = data[i].name
                let symbol = data[i].symbol
                ids.push({
                    'id': id,
                    'name': name,
                    'symbol': symbol
                })
            }
            checkForInfo(ids).done((data) => {
                let amount = 0
                for (let i = 0; i < 115; i++) {
                    if (data[ids[i].id].ils !== undefined) {
                        amount++
                        drawCard(ids[i])
                        $('.more-btn').unbind().click(e => showMoreInfoCard(e.target))
                        $('.checkbox').unbind().click(e => addCoinToReport(e.target))
                    }
                }
                setTimeout(console.log(amount + ' coins loaded'), 300)
                $('.popup-loading').fadeOut('slow', () => {
                    drawHome()
                    $('.popup-loading').remove()
                })
            })
        })
    }

    // UI: show more info in card after btn triger
    function showMoreInfoCard(target) {
        let div = $(target).parent().siblings('.coin-info');
        let id = $(target).parents('.coin-card')[0].id
        if (div.css('display') == 'none') {
            $(target).text('Less Info');
            // opens more info
            if (validateCoinInfoInStorage(id)) {
                console.log('coin in storage and up to date');
                loadInfoInHtml(div, getCoinObj(id))
                div.slideDown('slow', () => div.css('display', 'flex'))
            } else {
                getCoinInfoAPI(id, div).done((data) => {
                    let name = data.name
                    let symbol = data.symbol
                    let logo = data.image.small
                    let usd = data.market_data.current_price.usd
                    let eur = data.market_data.current_price.eur
                    let ils = data.market_data.current_price.ils
                    coin = new Coin(name, symbol, id, logo, usd, eur, ils, Date.now())
                    addCoinToStorage(coin, 'coinInfo')
                    $('.popup-loading').fadeOut('fast', () => {
                        $('.popup-loading').remove()
                    })
                    setTimeout(() => loadInfoInHtml(div, coin), 300)
                })
            }
            setTimeout(() => closeMoreInfoCard(target, div), 30000)
        } else {
            // close more info
            closeMoreInfoCard(target, div)
        }
    }
    // UI: close more info
    function closeMoreInfoCard(target, div) {
        $(target).text('More Info');
        div.slideUp('fast', () => {
            div.html('')
            div.css('display', 'none')
        })
    }
    // UI: add coin to live report list after btn triger
    function addCoinToReport(target) {
        let id = $(target).parents('.coin-card')[0].id
        let symbol = $('#' + id).parents('.top-div').attr('id')
        let toggle = $(target).prop('checked')
        let parent = $(target).parents('.top-div')[0]
        if (toggle) {
            getUSDofSymbol(symbol).done(data => {
                if (!data.Response && !isEmpty(data)) {
                    if (getArrFromStorage('chosenCoinsIds').length >= 5) {
                        $('.home-con').css('display', 'none')
                        $('.checkbox').prop('checked', false)
                        $('.home-con').prepend($(parent))
                        addCoinToStorage(id, 'chosenCoinsIds')
                        showDeleteMenu()
                    } else {
                        addCoinToStorage(id, 'chosenCoinsIds')
                        $('.home-con').prepend($(parent))
                    }
                }else{
                    $(`#${id}-checked`).prop('checked', false)
                    drawPopUpScreen('No info for live Report..')
                }
            })
        } else {
            removeCoinFromStorage(id, 'chosenCoinsIds')
        }

    }
    // UI: show delete menu
    function showDeleteMenu() {
        drawDeleteMenu()
        drawLoadingScreen('.delete-selection')
        let coinsArr = getArrFromStorage('chosenCoinsIds')
        $('.popup-loading').fadeIn('fast', () => {
            $('.popup-loading').css('display', 'flex')
            coinsArr.map(coinId => {
                let coin
                if (validateCoinInfoInStorage(coinId)) {
                    console.log('coin in storage and up to date');
                    coin = getCoinObj(coinId)
                    loadInfoToDeleteMenu(coin)
                } else {
                    getCoinInfoAPI(coinId, 'none').done((data) => {
                        let name = data.name
                        let symbol = data.symbol
                        let logo = data.image.small
                        let usd = data.market_data.current_price.usd
                        let eur = data.market_data.current_price.eur
                        let ils = data.market_data.current_price.ils
                        coin = new Coin(name, symbol, coinId, logo, usd, eur, ils, Date.now())
                        addCoinToStorage(coin, 'coinInfo')
                        loadInfoToDeleteMenu(coin)
                    })
                }
            })
        })
        $('.popup-loading').fadeOut('fast', () => {
            $('.popup-loading').remove()
            $('.chosen-list').css('display', 'flex')
        })
        $('.home-btn').off('click')
        $('.about-btn').off('click')
        $('.report-btn').off('click')
    }


    // -- UI Live-Reports functionality
    // UI live report: create chosen coins symbols and create data objects in array
    function getChosenCoinsSymbols() {
        let chosenCoinsArr = getArrFromStorage('chosenCoinsIds')
        let text = 'Compared Coins:'
        dataBase = chosenCoinsArr.map(coinId => {
            let symbol = $('#' + coinId).parents('.top-div').attr('id')
            text = text + ' ' + symbol.toUpperCase() + ','
            return new Data(symbol.toUpperCase())
        })
        data = {
            text,
            dataBase
        }
        return data
    }

    // UI live report: run chart
    function runLiveReport({
        text,
        dataBase
    }) {
        let options = {
            animationEnabled: true,
            theme: 'dark1',
            title: {
                text: "Live-Reports"
            },
            subtitles: [{
                text: text
            }],
            axisX: {
                title: "Time",
                labelFormatter: function (e) {
                    return CanvasJS.formatDate(e.value, "hh:mm:ss TT");
                },
            },
            axisY: {
                title: "US Dollars",
                valueFormatString: "#,##0.##",
                prefix: "$"
            },
            toolTip: {
                content: "{name} ${y}",
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: dataBase
        };
        $("#chartContainer").CanvasJSChart(options);

        // Live updating
        updateData(dataBase)

        function updateData(dataBase) {
            let symbolsTxt = []
            for (const coin in dataBase) {
                symbolsTxt.push(dataBase[coin].name)
            }
            getUSDofSymbol(symbolsTxt.join(',')).done(data => addData(data))
        }

        function addData(data) {
            for (const coin in dataBase) {
                dataBase[coin].dataPoints = [...dataBase[coin].dataPoints, {
                    x: Date.now(),
                    y: data[dataBase[coin].name].USD
                }]
            }
            $("#chartContainer").CanvasJSChart().render()
            setTimeout(updateData, 1500, dataBase);
        }

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
    }

    // -- Navigation Funcs

    // nav func: draw home
    function drawHome() {
        $('.report').remove()
        $('.about').remove()
        if (getArrFromStorage('chosenCoinsIds') != []) {
            let chosenCoinsArr = getArrFromStorage('chosenCoinsIds')
            chosenCoinsArr.forEach(id => {
                $(`#${id}-checked`).prop('checked', true)
                $('.home-con').prepend($('#'+id).parents('.top-div'))
            })
        }
        $('.home-con').fadeIn('slow', () => {
            $('.home-con').css('display', 'flex')
        })
        $('.search-input').val('')
        $('.top-div').css('display', 'block') //show coin cards
        closeMenuBurger()
        scrollToTop()
    }
    // nav func: Report TODO
    function showReport() {
        $('.home-con').css('display', 'none')
        $('.about').remove()
        $('.report').css('display', 'flex')
        $('.search-input').val('')
        $('.main').append(`
        <div class="report w-100 rounded overflow-hidden mt-3 d-flex">
        <div class="shadow-lg" id='chartContainer' style='min-height: 300px; height: 80%; ;width: 100%;'></div>
        </div>
        `)
        runLiveReport(getChosenCoinsSymbols())
        closeMenuBurger()
        scrollToTop()
    }
    // nav func: About TODO
    function showAbout() {
        $('.home-con').css('display', 'none')
        $('.report').remove()
        $('.search-input').val('')
        $('.main').append(`
        <div class="about pb-3 w-100 mt-3 d-flex flex-column justify-content-evenly align-items-center">
        <div class="row mt-3 w-100">
        <h1 class="about-txt col-12 col-md-6 m-auto text-center text-white display-2">Wow!</h1>
        <div class="pics pic1 col-12 col-md-6 m-auto"></div>
        </div>
        <div class="row mt-3 w-100">
        <div class="pics pic3 col-12 col-md-6 m-auto"></div>
        <h1 class="about-txt col-12 col-md-6 m-auto text-center text-white display-4">That Was Fun!</h1>
        </div>
        <div class="row mt-3 w-100">
        <h3 class="about-txt col-12 col-md-6 m-auto text-center text-white">How About some <a target="_blank" rel="noopener noreferrer" href="https://youtu.be/mRN_T6JkH-c?t=37"><h3>8 Bit Tunes</h3></a> with your Bit Coin? </h3>
        <div class="pics pic2 col-12 col-md-6 m-auto"></div>
        </div>
        </div>
        `)
        closeMenuBurger()
        scrollToTop()
    }
    // nav func: scroll to top
    function scrollToTop() {
        let getOffset = $('.logo').offset().top
        $('html,body').animate({
            scrollTop: getOffset
        }, 1000)
    }
    // nav func: close menu Burger
    function closeMenuBurger() {
        if ($('.menu-row').css('display') == 'flex') {
            $('.menu-row').slideUp('slow', () => {
                $('.menu-row').css('display', 'none')
                $('.burger').css('transform', 'rotate(0deg)')
            })
        }
    }


    // --API calls

    // API call: -Home Page- get all coin names from API
    function getAllCoinIds() {
        return $.ajax({
            type: "GET",
            url: "https://api.coingecko.com/api/v3/coins/list",
            data: 'data'
        })
    }
    // API call: -More Info- get coin info from API
    function getCoinInfoAPI(id, div) {
        return $.ajax({
            type: "GET",
            url: `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
            data: 'data',
            beforeSend: () => {
                switch (div) {
                    case 'none':
                        break;
                    default:
                        div.slideDown('fast', () => {
                            div.css('display', 'flex')
                            drawLoadingScreen(div)
                            $('.popup-loading').fadeIn('fast')
                        })
                }
            }
        });
    }
    // API call: -draw home- to check if theres Info on coin before its added to display
    function checkForInfo(ids) {
        ids = ids.map(id => id = id.id + '%2C').join('')
        return $.ajax({
            type: 'GET',
            url: `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=ils%2Cusd%2Ceur&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`,
            data: 'data'
        })
    }

    // Api call: -live-report- get coin dollar value
    function getUSDofSymbol(symbolsTxt) {
        return $.ajax({
            type: 'GET',
            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbolsTxt}&tsyms=USD`,
            data: 'data'
        })
    }
    // --Local Storage Funcs

    // local storage func: get array from local storage
    function getArrFromStorage(arrName) {
        return JSON.parse(localStorage.getItem(arrName))
    }
    // local storage funv: add coin object/coin id to array
    function addCoinToStorage(coin, arrName) {
        let coinArr = getArrFromStorage(arrName)
        coinArr.push(coin)
        localStorage.setItem(arrName, JSON.stringify(coinArr))
    }
    // local storage func: check if coin is in storage and is up to date
    function validateCoinInfoInStorage(id) {
        let coinArr = getArrFromStorage('coinInfo')
        if (coinArr === []) {
            return false
        } else {
            coin = coinArr.find(coin => coin.id === id)
            if (coin === undefined) {
                return false
            } else {
                if ((Date.now() - coin.time) > 120000) { // 120,000 ms = 2 mins
                    removeCoinFromStorage(id, 'coinInfo')
                    return false
                } else {
                    return true
                }
            }
        }
    }
    // local storage func: remove coin obj/coin id from storage
    function removeCoinFromStorage(id, arrName) {
        console.log('removing coin ' + id);
        let coinArr = getArrFromStorage(arrName)
        switch (arrName) {
            case 'coinInfo':
                coinArr = coinArr.filter(coin => coin.id !== id)
                break
            case 'chosenCoinsIds':
                coinArr = coinArr.filter(coin => coin !== id)
                break
        }
        localStorage.setItem(arrName, JSON.stringify(coinArr))
    }
    // local storage func: get info from local storage
    function getCoinObj(id) {
        let coinArr = getArrFromStorage('coinInfo')
        let coin = coinArr.find(coin => coin.id === id)
        console.log('coin delievered from storage');
        return coin
    }

    // ----GLOBAL-Events

    // GLOBAL-Event: menu collapse event
    $('.burger').click(() => {
        if ($('.menu-row').css('display') == 'flex') {
            $('.menu-row').slideUp('slow', () => {
                $('.menu-row').css('display', 'none')
                $('.burger').css('transform', 'rotate(0deg)')
            })
        } else {
            $('.burger').css('transform', 'rotate(-90deg)')
            $('.menu-row').slideDown('slow', () => {
                $('.menu-row').css('display', 'flex')
            })
        }
    })
    // GLOBAL-Event: click on start btn loads home page and scrolls down to begginig of page
    $('.start-btn').click(() => {
        $('.start-btn').fadeOut('slow', () => {
            loadApp()
            scrollToTop()
        })
    })
    // GLOBAL-Event: show scroll to top btn and click event
    $(window).scroll(() => {
        let currentScrollPosition = $(window).scrollTop();
        if (currentScrollPosition > 1000) {
            if ($('.scroll-top-btn').css('display') == 'none') {
                $('.scroll-top-btn').fadeIn('fast')
            }
        } else {
            $('.scroll-top-btn').fadeOut('fast')
        }
    })
    $('.scroll-top-btn').click(() => {
        let getOffset = $('.logo').offset().top
        $('html,body').animate({
            scrollTop: getOffset - 200
        }, 300)
    })
    // Global-Event: search filter
    $('.search-input').on("keyup", e => {
        var value = $(e.target).val()
        if (value == '') {
            $('.top-div').css('display', 'block')
        } else {
            $('.top-div').css('display', 'none')
            try {
                $(`[id^=${value.toLowerCase()}]`).css('display', 'block')
                $(`[id^=${value.toLowerCase()}]`).parents('.top-div').css('display', 'block')
            } catch (error) {
                console.log(error);
            }
        }
    });
    // Global-Event: click on home btn
    $('.home-btn').click(() => drawHome())
    // Global-Event: click on about btn
    $('.about-btn').click(() => showAbout())
    // Global-Event: click on live-report btn
    $('.report-btn').click(() => getArrFromStorage('chosenCoinsIds').length ? showReport() : drawPopUpScreen('Please select 1-5 coins for live report..'))

    // MAIN!!
    $(document).ready(function () {
        localStorage.clear()
        if (localStorage.getItem('coinInfo') == null) {
            localStorage.setItem('coinInfo', '[]')
        }
        if (localStorage.getItem('chosenCoinsIds') == null) {
            localStorage.setItem('chosenCoinsIds', JSON.stringify(['3x-long-algorand-token','12ships','1world','300fit','01coin']))
        }
        console.log('site loaded');
    })
})