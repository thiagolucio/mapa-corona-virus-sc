# Mapa do Corona Vírus - Projeto - versão 1
### Link da Matéria:
- [Materia do Corona Vírus versão 1][materia]

[materia]: https://www.nsctotal.com.br/coronavirus/mapa-de-evolucao-do-virus

#### Sobre o Desenvolvimento:
- Este projetinho foi desenvolvido em HTML, CSS, Ecma Script puros. Não foram usados Frameworks ou quaisquer soluções de camadas de desenvolvimento. É um projeto pequeno e simples, pensado para ser leve e rápido e de estrutura mais simplifcada possível. 

- Ele é injetado por `<iframe>` dentro do Portal da NSC, no link indicado acima. Isso é feito através da interface de Geranciamento do Drupal de forma padronizada do CMS. 

- O projeto fica hospedade em um Bucket simples dentro da AWS da NSC. No endereço abaixo:
[Mapa Corona AWS Bucket](https://s3.console.aws.amazon.com/s3/buckets/nsc-total?region=sa-east-1&prefix=especiais/coronavirus/)

- Caso você venha a trabalhar no projeto não se esqueça de solicitar seu acesso ao César da TI. Solicite por email : [cesar.oliveira@somosnsc.com.br](cesar.oliveira@somosnsc.com.br)

### *** Recomendações ***
- Como o projeto não possui nenhum gerenciador de pacotes ou qualquer outra solução neste sentido. Você não poderá se esquecer de minificar o código a fim de melhorar o desempenho de carregamento da página pois ela já roda dentro do Site da NSC. 

- Não coloque conteúdos AMP neste projeto. O portal da NSC Total já possui essa solução, quando vc inclúi na página via Drupal essa solução já é aplicada ao link da página onde ela é "iframezada". Então não faça inclusões de conf AMP Aqui. 


## Referências:
- [Página especial do coronavírus no NSC Total][coronavirus]
- [Planilha no Google Spreadsheet com dados da Redação][spreadsheet]
- [Leaflet: mapas em JavaScript][leaflet]
- [Dados geográficos no formato geoJSON][geojson]
- [Mapshaper: exportação de arquivo geoJSON][mapshaper]
- [Personalização Mapa: ][personalizacao]
- [Usando Bootstrap 5 para layout: ][bs5]

[coronavirus]: https://www.nsctotal.com.br/coronavirus
[leaflet]: https://leafletjs.com/examples/choropleth/
[geojson]: https://leafletjs.com/examples/geojson/
[mapshaper]: https://mapshaper.org/
[spreadsheet]: https://docs.google.com/spreadsheets/d/18aj1TPYZxwEwxRvqdXj-hgJpQda2A1ny9S0QaIHBp-o/edit#gid=0
[personalizacao]: https://leafletjs.com/reference-1.6.0.html#control
[bs5]: https://getbootstrap.com/


## Versão 2 do Sistema - em desenvolvimento

- [Versão 2 do Mapa do Corona - Em desenvolvimento][https://github.com/nsccomunicacao/mapa-coronavirus-v2]
- [Versão 2 Showcase projeto][https://github.com/nsccomunicacao/mapa-corona-virus-showcase]
