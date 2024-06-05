// 检查页面是否是 d3-cloud 分页
// if (window.location.pathname.endsWith("d3-cloud.html")) {
//   // 在 d3-cloud 分页加载时，自动触发生成文字云的逻辑
//   generateWordCloudOnPageLoad();
// }

function generateWordCloudOnPageLoad(data) {
  // 读取记录文件
  // fetch('recode.json')
  //     .then(response => response.json())
  //     .then(data => {
  //         // 从数据中提取所有的文本
  //         //const allTexts = data.map(entry => entry.text);
  //         //取最新的文字內容(單位為條)
  //         const allTexts = data.slice(-1).map(entry => entry.text);
  //         // 生成词云
  //         generateWordCloud(allTexts);
  //     })
  //     .catch(error => console.error('Error:', error));
  //从数据中提取所有的文本;
  const allTexts = data.map((entry) => entry.text);
  //取最新的文字內容(單位為條)
  //const allTexts = data.slice(-1).map(entry => entry.text);
  // 生成词云
  generateWordCloud(allTexts);
}
function generateWordCloud(texts) {
  // 清空词云容器
  document.getElementById("wordcloud-container").innerHTML = "";

  // 将文本分解为单词
  const words = texts
    .join(" ")
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word !== "");

  // 计算每个单词的出现次数
  const wordCounts = {};
  words.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // 将单词转换为 d3-cloud 需要的格式
  // const wordCloudData = Object.keys(wordCounts).map(word => ({
  //     text: word,
  //     size: wordCounts[word]
  // }));
  //設定出現次數大於幾的詞可以顯示
  const filteredWords = Object.keys(wordCounts).filter(
    (word) => wordCounts[word] >= 2
  );

  // 将单词转换为 d3-cloud 需要的格式
  const wordCloudData = filteredWords.map((word) => ({
    text: word,
    size: wordCounts[word],
  }));

  // 创建词云布局
  const layout = d3.layout
    .cloud()
    .size([400, 400])
    .words(wordCloudData)
    .padding(5)
    .rotate(() => Math.random() * 60 - 30)
    .fontSize((d) => 10 + d.size * 5)
    .on("end", draw);

  layout.start();

  // 渲染词云
  function draw(words) {
    // 创建 Canvas 元素
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const context = canvas.getContext("2d");
    //背景顏色
    context.fillStyle = "yellow";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 将词云绘制到 Canvas 上
    words.forEach((word) => {
      context.font = `${word.size}px Arial`;
      //詞的顏色
      context.fillStyle = "black";
      context.textAlign = "center";
      //調整字的位置
      const x = word.x + 200;
      const y = word.y + 200;
      context.fillText(word.text, x, y);
    });

    // 将 Canvas 转换为图像的数据 URL
    const dataURL = canvas.toDataURL("image/jpeg");

    // 创建图像元素
    const imgElement = document.createElement("img");
    imgElement.src = dataURL;

    imgElement.style.position = "absolute";
    imgElement.style.top = "200px";
    imgElement.style.left = "200px";

    // 插入到词云容器中
    document.getElementById("wordcloud-container").appendChild(imgElement);
  }
}
