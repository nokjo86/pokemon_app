const fetch = require('node-fetch');
const readline = require('readline-sync');
const _= require('lodash');
const figlet = require('figlet');
const chalk = require('chalk');

const game = () => {

const next_game = (cb) => {
  const nextMenu = () => {
    figlet('Next Pokemon', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    }); 
  }
  nextMenu()
    let options = [chalk.cyan('Continue'), chalk.cyan('Quit')]
    let choice = readline.keyInSelect(options,'> ');
  if(choice===0){
    console.clear()
    cb(next_game)

  }
  else {
    console.clear()
    console.log(chalk.bgRed('Your journey has come to an end, unfortunately.'))
    process.exit()
  }
}

const quiz = (cb) => {
const getPokemon = async () => {
    try {
      let randomNumber =  Math.ceil(Math.random() * Math.floor(151))
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`)     
      const data = await response.json()
      return data
    } catch(err) {
      console.log(err)
    }
  }

const pokemonArray = [];

while (pokemonArray.length < 4) {
pokemonArray.push(getPokemon())

}

Promise.all(pokemonArray).then((response) => guessPokemon(response))


let pokemons=[]
const guessPokemon = (array) => {
    
    let chosenPokemon = array[Math.floor(Math.random() * 4)]
    array.forEach(pokemon => {
      pokemons.push(_.capitalize(pokemon.name))
    })
    let correct_answer = pokemons.indexOf(_.capitalize(chosenPokemon.name))
    console.log(`Id: ${chosenPokemon.id}`);
          let answer = readline.keyInSelect(pokemons, "Who's that Pokemon?");
      if (answer === correct_answer) {
          console.log(chalk.green("Correct!"));
          setTimeout(function(){
          console.clear()
          cb(quiz)
          }, 2000);
      } else {
          console.log(`Type: ${chosenPokemon.types[0].type.name}`);
          answer = readline.keyInSelect(pokemons, "Who's that Pokemon?");
        if (answer === correct_answer) {
            console.log(chalk.green("Correct!"));
            setTimeout(function(){
            console.clear()
            cb(quiz)
            }, 2000);
          } else {
              console.log(chalk.red("Wrong, guess again. Hint as below:"));
              console.log(chalk.yellowBright(`Move: ${chosenPokemon.moves[0].move.name}`));
              let answer = readline.keyInSelect(pokemons, "Who's that Pokemon?");
              if (answer === correct_answer) {
                console.log(chalk.green("Correct!"));
                setTimeout(function(){
                console.clear()
                cb(quiz)
                }, 2000);
              } else {
                console.log(chalk.red(`Wrong, Game Over! The correct answer is ${chalk.green(_.capitalize(chosenPokemon.name))}`));
              }
          }
      }
}
}
quiz(next_game)
}
game()
module.exports = { game }


