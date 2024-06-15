import React, { useEffect, useState } from "react";
import { Flex, Stack } from "@chakra-ui/layout";
import { Button, Input, Text, Progress } from "@chakra-ui/react";
import Cloud from "./cloud";
import styled from "@emotion/styled";
import moment from "moment";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import { chatStartTime, chatAnalysis } from "../Utilities/api";
export default function Analysis(props) {
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();
  const [amount, setAmount] = useState();
  const [chatStart, setChatStart] = useState();
  const [maxRange, setMax] = useState();
  const [currentValue, setCurrValue] = useState([]);
  const currentDate = new Date();
  const timestamp = moment(currentDate.getTime()).format("YYYY-MM-DD");
  const [result, setResult] = useState({});
  useEffect(() => {
    chatStartTime(props.userID, props.chatID)
      .then((res) => {
        let startChat = moment(res.startTime).format("YYYY-MM-DD");
        let range = calcDate(startChat, timestamp);
        setStartDate(startChat);
        setEndDate(timestamp);
        setChatStart(startChat);
        setMax(Math.abs(range));
        setAmount(Math.abs(range));
        setCurrValue([0, Math.abs(range)]);
        createReport(startChat, timestamp);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.chat]);
  const calcDate = (start, end) => {
    let sDate = moment(start, "YYYY-MM-DD");
    let eDate = moment(end, "YYYY-MM-DD");
    return eDate.diff(sDate, "days") + 1;
  };
  const changeRange = ([newStart, newEnd]) => {
    setCurrValue([newStart, newEnd]);
    let start = moment(chatStart, "YYYY-MM-DD").add(newStart, "days");
    let end = moment(timestamp, "YYYY-MM-DD").subtract(
      maxRange - newEnd,
      "days"
    );
    let range = calcDate(start, end);
    setStartDate(moment(start).format("YYYY-MM-DD"));
    setEndDate(moment(end).format("YYYY-MM-DD"));
    setAmount(range);
  };
  const ChangeAmount = (e) => {
    setAmount(e);
    let start = currentValue[1] - e;
    let startDay = moment(chatStart, "YYYY-MM-DD").add(start, "days");
    setCurrValue([start, currentValue[1]]);
    setStartDate(moment(startDay).format("YYYY-MM-DD"));
  };
  const ChangeEnd = (e) => {
    setEndDate(e);
    let end = calcDate(chatStart, e);
    setAmount(end - currentValue[0]);
    setCurrValue([currentValue[0], end]);
  };
  const createReport = (start, end) => {
    let startD = new Date(start);
    let getStart = startD.getTime();
    let nextday = moment(end, "YYYY-MM-DD").add(1, "days");
    let endD = new Date(nextday);
    let getEnd = endD.getTime();
    chatAnalysis(props.userID, props.chatID, getStart, getEnd)
      .then((res) => {
        setResult(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const reset = () => {
    setEndDate(timestamp);
    setStartDate(chatStart);
    setCurrValue([0, maxRange]);
    setAmount(maxRange);
  };
  return (
    <Stack h="100%">
      <Flex h="80%" w="100%">
        {result.keyword && <Cloud keyword={result.keyword} />}
        <Stack w="40%" mr="40px" ml="40px" justifyContent="space-around">
          <Stack>
            <AnalysisD fontFamily="Abril Fatface">{result.avgScore}%</AnalysisD>
            <AnalysisT>Average degree of revising</AnalysisT>
          </Stack>
          <Flex justifyContent="space-between" alignItems="flex-end">
            <Stack>
              <AnalysisD fontFamily="Abril Fatface">{result.rewriteCount}</AnalysisD>
              <AnalysisT>Number of<br/>revised messages</AnalysisT>
            </Stack>
            <Stack>
              <Text fontSize="50px" fontWeight="900" lineHeight="40px" fontFamily="Abril Fatface">
                {result.totalCount}
              </Text>
              <AnalysisT>Number of<br/>total messages</AnalysisT>
            </Stack>
          </Flex>
          <Stack>
            <Text lineHeight="50px" fontSize="40px" m="auto" fontWeight="900" fontFamily="Abril Fatface">
              {result.ratio}%
            </Text>
            <Progress
              colorScheme="bar"
              bgColor="#7d7a7a"
              value={result.ratio}
              borderRadius="10px"
              p="2px"
            />
            <Flex justifyContent="space-between">
              <AnalysisT>me</AnalysisT>
              <AnalysisT>percentage of<br/>revising</AnalysisT>
              <AnalysisT>other</AnalysisT>
            </Flex>
          </Stack>
        </Stack>
      </Flex>
      {/* <FormControl h="20%"> */}
      <Flex h="20%">
        <Flex w="100%" h="60px" mt="calc(13vh - 64px)">
          <Flex
            bgColor="white"
            flexGrow={1}
            mr="10px"
            ml="10px"
            borderRadius="30px"
            pl="10px"
            pr="10px"
            alignItems="center"
          >
            <Input
              name="amount"
              w="90px"
              value={amount}
              onChange={(e) => ChangeAmount(e.target.value)}
              border="none"
              focusBorderColor="#ffffff"
            />
            <Text mr="15px">days</Text>
            <Slider
              range
              allowCross={false}
              trackStyle={{ backgroundColor: "black" }}
              handleStyle={{
                borderColor: "black",
                backgroundColor: "black",
                boxShadow: "0",
              }}
              min={0}
              max={maxRange}
              value={currentValue}
              defaultValue={[0, maxRange]}
              onChange={(e) => changeRange(e)}
            />
            <Input
              type="date"
              w="200px"
              name="endDate"
              placeholder="search for user name..."
              value={endDate}
              onChange={(e) => ChangeEnd(e.target.value)}
              border="none"
              focusBorderColor="#ffffff"
            />
          </Flex>
          <Stack width="8vw" mr="10px">
            <Button
              type="submit"
              borderRadius="10px"
              fontSize="12px"
              onClick={() => createReport(startDate, endDate)}
            >
              Calculate
            </Button>
            <Button
              type="reset"
              borderRadius="10px"
              fontSize="12px"
              onClick={() => reset()}
            >
              Reset
            </Button>
          </Stack>
        </Flex>
      </Flex>
      {/* </FormControl> */}
    </Stack>
  );
}
const AnalysisT = styled(Text)`
  color: #7d7a7a;
  font-size: 13px;
  font-weight: 600;
`;
const AnalysisD = styled(Text)`
  color: black;
  font-size: 100px;
  font-weight: 900;
  line-height: 90px;
`;
