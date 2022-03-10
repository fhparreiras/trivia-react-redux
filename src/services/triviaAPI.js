export const getToken = async () => {
  const url = 'https://opentdb.com/api_token.php?command=request';
  const request = await fetch(url);
  const requestJson = await request.json();
  const tokenJson = requestJson.token;
  localStorage.setItem('token', tokenJson);
  return tokenJson;
};

export const getQuestions = () => {
  // const url = 'https://opentdb.com/api.php?amount=5&token=${seu-token-aqui}'; endpoint para pegar 5 perguntas
};
