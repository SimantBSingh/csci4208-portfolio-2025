const Leaderboard = (topScores) => ( //Function for HTML component
`<h2>Top Scores:</h2>
<section>
<ol>
${ ListItems(topScores) }
</ol>
</section>`
);
export default Leaderboard; //Export Leaderboard function

const ListItems = (topScores) => { //Function for HTML component
let li =``; //empty string for HTML of list items
const scores = topScores.sort( (a,b) => b.score - a.score ); //sort by scores
for (let row of scores){ //for each row in scores
li +=`<li>${row.name}: ${row.score}</li>` //concat row to HTML string
}
return li; //return HTML-formatted text
}