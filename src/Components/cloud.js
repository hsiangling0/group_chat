import React, { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/layout";
import cloud from "d3-cloud";
export default function Cloud(props) {
  const [dataURL, setDateURL] = useState("");
  useEffect(() => {
    generateWordCloud(props.keyword);
  }, [props.keyword]);
  const generateWordCloud = (keyword) => {

    const wordCloudData = keyword.map((word) => ({
      text: word[0].toUpperCase(),
      size: word[1],
    }));

    const layout = cloud()
      .size([700, 700])
      .words(wordCloudData)
      .padding(15)
      .rotate(0)
      .fontSize((d) =>d.size * 43)
      .on("end", draw);

    layout.start();

    function draw(words) {
      setDateURL("");
      const canvas = document.createElement("canvas");
      canvas.width = 700;
      canvas.height = 700;
      const context = canvas.getContext("2d");
      context.fillStyle = "hsla(0, 0%, 100%, 0)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      words.forEach((word) => {
        context.font = `900 ${word.size}px Arial`;
        context.fillStyle = "rgb(0,0,0)";
        context.textAlign = "center";
        const x = word.x + 350;
        const y = word.y + 350;
        context.fillText(word.text, x, y);
      });

      const dataURL = canvas.toDataURL();
      setDateURL(dataURL);
    }
  };
  return (
    <Flex w="70%" justifyContent="center">
      <img src={dataURL}></img>
    </Flex>
  );
}
