const AVATAR_URL = 'https://avatars3.githubusercontent.com/u/46694610?s=460&v=4';
const main = document.querySelector('main');
const textarea = document.querySelector('textarea');
const tweetBtn = document.querySelector('form');
const tweetActualBtn = document.querySelector('#tweet');
const myAvatar = [...document.querySelectorAll('.my_avatar')];
myAvatar.forEach(img => img.src = AVATAR_URL);
const pollBtn = document.querySelector('#pollbtn')
const imgGifPoll = document.querySelector('#imgGifPoll');

//gif variables
const searchGifBtn = document.querySelector('#searchGifBtn');
const searchGif = document.querySelector('#searchGif');
const browseGifs = document.querySelector('#browsegifs');

// Emoji variables
const emojibtn = document.querySelector('#emojibtn');
const emojimodalbody = document.querySelector('#emojimodalbody')
const searchEmoji = document.querySelector('#searchEmoji');
const emojiCategories = document.querySelector('#emojiCategories');


let imgUpload = null; 
let gifSelected = null;
const tweets = [];

let gifs = [];

const originalGifs = [];


let emojis = [];

function render() {

  remember();

  main.innerHTML = tweets.map((tweet, idx) => {

    return `
        <aside>
         <div>
            <img class="avatar" src="${tweet.avatar}">
         </div>
         <div class="formatted-tweet">
            <h6><a href="https://twitter.com/${tweet.username}">${tweet.name}</a> <span class="username">@${tweet.username}</span></h6>
            <p>${tweet.tweet}</p>
            <div class="imgGifPoll">
              ${tweet.isPollCreated ? displayVotes(tweet, idx) : ''}
              ${tweet.img ? loadImg(tweet.img) : ''}
              ${tweet.gif ? loadGif(tweet.gif) : ''}
            </div>
            <div>
                <section>
                    <div id="reactions" class="btn-group mr-2">
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-message-outline"
                            aria-label="reply"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-twitter-retweet"
                            aria-label="retweet"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-heart-outline"
                            aria-label="like"
                            style=""
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-upload"
                            aria-label="share"
                        ></button>
                    </div>
                </section>
            </div>
        </div>
        </aside>
          `;
  }).join('');
}

function remember() {

  localStorage.removeItem('twitter');


  localStorage.setItem('twitter', JSON.stringify(tweets))
}

function votesToPercentages(votes) {
  const total = votes.a + votes.b + votes.c + votes.d;

  return {
    a: Math.floor((votes.a / total) * 100),
    b: Math.floor((votes.b / total) * 100),
    c: Math.floor((votes.c / total) * 100),
    d: Math.floor((votes.d / total) * 100),
    total
  }

}

function displayVotes(tweet, idx) {
  const percents = votesToPercentages(tweets[idx].pollResults)
  const letterChosen = tweets[idx].pollResults.youChose;

  if (tweet.isPollDone) {
    return `
    <div class="bargraph">
    <div id="bar1" class="bar" style="flex-basis: ${
      percents.a
    }%" data-vote="a">${tweets[idx].voteOptions.a} ${
    letterChosen == "a" ? "&check;" : ""
  }</div>
    <div id="percentage1">${percents.a}%</div>
  </div>
  <div class="bargraph">
    <div id="bar2" class="bar" style="flex-basis: ${
      percents.b
    }%" data-vote="b">${tweets[idx].voteOptions.b} ${
    letterChosen == "b" ? "&check;" : ""
  }</div>
    <div id="percentage2">${percents.b}%</div>
  </div>
  <div class="bargraph">
    <div id="bar3" class="bar" style="flex-basis: ${
      percents.c
    }%" data-vote="c">${tweets[idx].voteOptions.c} ${
    letterChosen == "c" ? "&check;" : ""
  }</div>
  <div id="percentage3">${percents.c}%</div>
  </div>
  <div class="bargraph">
    <div id="bar4" class="bar" style="flex-basis: ${
      percents.d
    }%" data-vote="d">${tweets[idx].voteOptions.d} ${
    letterChosen == "d" ? "&check;" : ""
  }</div>
  <div id="percentage4">${percents.d}%</div>
  </div>
  <div id="totalVotes">${percents.total} votes</div>
    `
  }
  return `
  <div class="poll flex-col" data-idx="${idx}">
     <button class="vote" value="a">${tweet.voteOptions.a}</button>
     <button class="vote" value="b">${tweet.voteOptions.b}</button>
     <button class="vote" value="c">${tweet.voteOptions.c}</button>
     <button class="vote" value="d">${tweet.voteOptions.d}</button>
  </div>
  `
}

function tweeting(e) {
  e.preventDefault();

  if(!textarea.value) {
    return false;
  }

  const voteOptions = {
    a: imgGifPoll.querySelector('#pollchoice1') ? imgGifPoll.querySelector('#pollchoice1').value : '',
    b: imgGifPoll.querySelector('#pollchoice2') ? imgGifPoll.querySelector('#pollchoice2').value : '',
    c: imgGifPoll.querySelector('#pollchoice3') ? imgGifPoll.querySelector('#pollchoice3').value : '',
    d: imgGifPoll.querySelector('#pollchoice4') ? imgGifPoll.querySelector('#pollchoice4').value : '',
  }

  if (textarea.value) {
    // store tweet text in tweets object
    tweets.unshift({
      avatar: AVATAR_URL,
      name: 'Balkarn Singh',
      username: 'Balkarn',
      tweet: textarea.value,
      img: imgUpload == null ? '' : imgUpload,
      gif: gifSelected == null ? '' : gifSelected,
      isPollCreated: !!(voteOptions.a && voteOptions.b && voteOptions.c && voteOptions.d),
      voteOptions,
      pollResults: {},
      isPollDone: false
    });

  }


  textarea.value = '';
  imgGifPoll.innerHTML = '';

  render();
  document.querySelector('#uploadPic').value = null;
  imgUpload = null;
  gifSelected = null;
}

function insertPoll() {
  // empty img input
  document.querySelector('#uploadPic').value = null;
  gifSelected = null;

  textarea.placeholder = 'Ask a question...';

  imgGifPoll.innerHTML = `
                <form>
                  <div class="form-group">
                    <input type="text" class="form-control" id="pollchoice1" aria-describedby="" maxlength="25" placeholder="Choice 1">
                    <br>
                    <input type="text" class="form-control" id="pollchoice2" aria-describedby="" maxlength="25" placeholder="Choice 2">
                    <br>
                    <input type="text" class="form-control" id="pollchoice3" aria-describedby="" maxlength="25" placeholder="Choice 3">
                    <br>
                    <input type="text" class="form-control" id="pollchoice4" aria-describedby="" maxlength="25" placeholder="Choice 4">
                    <br><br>
                    <h6>Poll length</h6>
                    <hr style="margin:0">
                    <div class="row">
                      <div class="col">
                        <label for="polldays">Days</label>
                        <select class="form-control" id="polldays">
                          <option>0</option>
                          <option selected>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="col">
                        <label for="pollhours">Hours</label>
                        <select class="form-control" id="pollhours">
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="col">
                        <label for="pollminutes">Minutes</label>
                        <select class="form-control" id="pollminutes">
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>

  `;
}

async function vote(e) {
  if (!e.target.matches('.vote')) {
    return;
  }


  const index = e.target.closest('.poll').dataset.idx;

  const res = await fetch('https://my.api.mockaroo.com/votes.json?key=2d95a440')
  const data = await res.json();
  const keyValues = Object.entries(data);
  const newKeyValues = keyValues.map(keyValArr => [keyValArr[0], parseInt(keyValArr[1].slice(-2), 10)])


  tweets[index].pollResults = Object.fromEntries(newKeyValues)
  tweets[index].pollResults.youChose = e.target.value
  tweets[index].isPollDone = true;

  render();
}

tweetBtn.addEventListener('submit', tweeting);
pollBtn.addEventListener('click', insertPoll);
main.addEventListener('click', vote)

render();


function handleFileSelect(e){
  const reader = new FileReader();

  reader.addEventListener('load', (e) => {
    imgGifPoll.innerHTML = `<img class="thumb" src="${e.target.result}" style="width:100%"/>`;
    imgUpload = reader.result;
    gifSelected = null;
  });

  reader.readAsDataURL(e.target.files[0])
}


document.querySelector('#uploadPic').addEventListener('change',handleFileSelect);


function loadImg(img) {
  return `<img src='${img}'>`;

}


function getGifs(){
  fetch(`https://api.giphy.com/v1/gifs/search?q=${searchGif.value}&api_key=GSPHd2Irj2BwIrvEWTiteNlu9i9LbPVP&limit=10`)
  .then(res => res.json())
  .then(data => {
    gifs.push(...data.data);
    const newHTML = gifs.map((gif, i) => `<img src="${gif.images.fixed_height_small.url}" data-index= "${i}">`).join('');
    browseGifs.innerHTML = newHTML;
    switchgifsarea.classList.remove('hide');

})
}

browseGifs.addEventListener('click', chooseGif);
function chooseGif(e) {
  imgUpload = null;
  if(!e.target.matches('img')){
    return
  }
  const index = e.target.dataset.index;
  console.log(gifs[index]);
  imgGifPoll.innerHTML = loadGif(gifs[index].id);
  gifSelected = gifs[index].id;

  $('#insertgif').modal('hide');
}


document.querySelector('#uploadPic').addEventListener('change', handleFileSelect, false);
tweetBtn.addEventListener('submit', tweeting);
searchGifBtn.addEventListener('click', getGifs);


function loadGif(id) {
  return `<video style="width:100%" controls>
  <source src="https://media.giphy.com/media/${id}/giphy.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>`;

}


emojibtn.addEventListener('click', browseEmojis);


function browseEmojis(){
  fetch('https://unpkg.com/emoji.json@12.1.0/emoji.json')
    .then(res => res.json())
    .then( data => {
      emojis.push(...data);
      displayEmojis();
    });
}

function displayEmojis(){
  emojimodalbody.innerHTML = emojis.map(emoji => `<div class="emoji">${emoji.char}</div>`).join(' ');
}
emojimodalbody.addEventListener('click', chooseEmoji);
used_emoji.addEventListener('click', chooseEmoji);
function chooseEmoji(e){
  if(e.target.className != 'emoji'){
    return;
  }
  textarea.value += e.target.textContent;
}
