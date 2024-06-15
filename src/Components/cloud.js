import React, { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/layout";
import cloud from "d3-cloud";
export default function Cloud(props) {
  const [dataURL, setDateURL] = useState("");
  useEffect(() => {
    console.log(props.keyword);
    generateWordCloud(props.keyword);
  }, [props.keyword]);
  const generateWordCloud = (keyword) => {

    // 将单词转换为 d3-cloud 需要的格式
    const wordCloudData = keyword.map((word) => ({
      text: word[0].toUpperCase(),
      size: word[1],
    }));

    // 创建词云布局
    const layout = cloud()
      .size([700, 700])
      .words(wordCloudData)
      .padding(15)
      .rotate(0)
      .fontSize((d) =>d.size * 43)
      .on("end", draw);

    layout.start();

    // 渲染词云
    function draw(words) {
      // 创建 Canvas 元素
      setDateURL("");
      const canvas = document.createElement("canvas");
      canvas.width = 700;
      canvas.height = 700;
      const context = canvas.getContext("2d");
      //背景顏色
      //   context.fillStyle = "white";
      context.fillStyle = "hsla(0, 0%, 100%, 0)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      // 将词云绘制到 Canvas 上
      words.forEach((word) => {
        context.font = `900 ${word.size}px Arial`;
        //詞的顏色
        // const isWhite = Math.floor(Math.random() * 2) * 255;
        // const randomColor = `rgb(
        //   ${isWhite},
        //   ${isWhite},
        //   ${isWhite}
        // )`;
        // const randomColor = "rgb(0,0,0)";

        context.fillStyle = "rgb(0,0,0)";
        context.textAlign = "center";
        //調整字的位置
        const x = word.x + 350;
        const y = word.y + 350;
        context.fillText(word.text, x, y);
      });

      // 将 Canvas 转换为图像的数据 URL
      const dataURL = canvas.toDataURL();

      // 创建图像元素
      setDateURL(dataURL);
    }
  };
  return (
    <Flex w="70%" justifyContent="center">
      <img src={dataURL}></img>
    </Flex>
  );
}
