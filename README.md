
# [English] Pelos Caminhos - Backend

Hello. I'm delighted that you've discovered my project. "Pelos Caminhos" is presented as the Final Course Project in the Computer Science program at the University of Caxias do Sul (UCS). It aims to be a platform that integrates three user profiles: the adopting user, the institution administrator, and volunteers. The complete project can be read [here](https://drive.google.com/file/d/1wGspejLclOVXlhErvAr8gK0-ASYVHKiR/view?usp=sharing).

It features backend permission systems with ACL implementation, public and private pages, animal registration and management, a public profile that can be shared using a QR code. It also includes an administration area for NGOs and visualization of existing animals.

The software includes a feature for animal recognition based on breed identification, utilizing the [Dog Breed Classification](https://github.com/stormy-ua/dog-breeds-classification) project as a foundation.

The architecture can be viewed [here](https://drive.google.com/file/d/1fjh1XuPdnr3KRJ3xh2vTvBD_iZ-qgDKM/view?usp=sharing).

## Technologies used in the backend

-   Express
-   Sequelize
-   Node
-   Flask
-   PostgreSQL

# Installation

The code follows a Code First approach, and there's no need to create the database manually. Simply configure a .env file with the NODE_ENV and the corresponding DATABASE_URL, like this:

`NODE_ENV='production'
DATABASE_URL='yourStringConnection'
FRONTEND_URL='http://localhost:3000'` 

If you're going to use the image recognition flow, make the Docker container available on a port and add it to your .env with the corresponding port, something like:
`AI_BREED_URL='http://localhost:5057/predict'` 

To install dependencies:

`npm i` 

To run:
`npm run dev` 

Or alternatively, in production:
`npm run build && npm run start` 

## Front-end project link

[Click here to access](https://github.com/lucasgehl3n/pelos-caminhos-frontend)

# [Português] Pelos Caminhos - Backend
Olá. Fico feliz que tenha encontrado o meu projeto. O "Pelos Caminhos" é um projeto apresentado como Trabalho de Conclusão de Curso no Curso de Ciência da Computação na Universidade de Caxias do Sul (UCS). Ele tem o objetivo de ser uma plataforma que mescla três perfis: o usuário adotante, o administrador de instituições e os voluntários. O trabalho completo pode ser lido [neste link](https://drive.google.com/file/d/1wGspejLclOVXlhErvAr8gK0-ASYVHKiR/view?usp=sharing). 

  
Ele conta com recursos como sistemas de permissões back-end com implementação de ACL, páginas públicas e privadas, cadastro e gerenciamento de animais, perfil público que pode ser compartilhado utilizando um QRCode. Conta também com a área para administração da ONG e visualização de animais existentes.
 

O software conta com um recurso para reconhecimento de animais a partir da identificação de raças, que utiliza como base o projeto [Dog Breed Classification](https://github.com/stormy-ua/dog-breeds-classification).
  
A arquitetura pode ser visualizada [neste link](https://drive.google.com/file/d/1fjh1XuPdnr3KRJ3xh2vTvBD_iZ-qgDKM/view?usp=sharing).

  
## Tecnologias utilizadas no back-end

 - Express
 - Sequelize
 - Node 
 - Flask
 - PostgreSQL

# Instalação

O código é Code First, não é necessário criar o banco de dados manualmente, apenas configurar um arquivo .env com o NODE_ENV e a DATABASE_URL correspondente, desta forma:

    NODE_ENV='production'
    DATABASE_URL='yourStringConnection'
    FRONTEND_URL='http://localhost:3000'

Caso vá utilizar o fluxo de reconhecimento de imagem, disponibilize o container Docker em uma porta e adicione no seu .env com a porta correspondente. Algo como: 

    AI_BREED_URL='http://localhost:5057/predict'

Para instalar as dependências

    npm i

Para executar

    npm run dev 

 
 Ou alternativamente, em produção:
 

    npm run build && npm run start

## Link do projeto front-end
[Clique aqui para acessar](https://github.com/lucasgehl3n/pelos-caminhos-frontend)



