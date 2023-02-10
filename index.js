const inputQuestion = document.getElementById('inputQuestion')
const result = document.getElementById('result')
require('dotenv').config();

inputQuestion.addEventListener('keypress', (e) => {
  if(inputQuestion.value && e.key === "Enter") SendQuestion()
})

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

function SendQuestion() {
  let Question = inputQuestion.value

  fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer  ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: Question,
      max_tokens: 2048, //tamanho da resposta da IA
      temperature: 0.5, //criatividade da resposta
    })
  })
  .then((response) => response.json())
  .then((json) => {
    if(result.value) result.value =+ '\n'

    if(json.error?.message) {
      result.value += `Error: ${json.error.message}`
    } else if (json.choices?.[0].text) {
      let text = json.choices[0].text || 'Sem resposta'

      result.value += ' Chat GPT: ' + text
    }

    result.scrollTop = result.scrollHeight
  })
  
  .catch((error) => console.error('Error: ', error))
  .finally(() => {
    inputQuestion.value = ''
    inputQuestion.desable = false
    inputQuestion.focus()
  })

  if (result.value) result.value += '\n\n\n'

  result.value += `Eu: ${Question}`
  inputQuestion.value = 'Carregando...'
  inputQuestion.disable = true

  result.scrollTop = result.scrollHeight
}
