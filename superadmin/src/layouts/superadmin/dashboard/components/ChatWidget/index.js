import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";

const ChatWidget = () => {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	const toggleChat = () => {
		setOpen(!open);
	};

	const sendMessage = () => {
		if (input.trim()) {
			setMessages([...messages, { text: input, sender: "user" }]);
			setInput("");
			// Simulate a bot response (optional)
			setTimeout(() => {
				setMessages((prev) => [...prev, { text: "Thanks for your message!", sender: "bot" }]);
			}, 1000);
		}
	};

	return (
		<Box
			sx={{
				position: "fixed",
				bottom: 16,
				right: 16,
				zIndex: 1000,
			}}
		>
			{open && (
				<Paper
					elevation={3}
					sx={{
						width: 320,
						height: 400,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						p: 2,
						position: "relative",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 2,
						}}
					>
						<Typography variant="h6">Chat with us</Typography>
						<IconButton onClick={toggleChat} size="small">
							<CloseIcon />
						</IconButton>
					</Box>
					<Box
						sx={{
							flexGrow: 1,
							overflowY: "auto",
							mb: 2,
						}}
					>
						{messages.map((msg, index) => (
							<Box
								key={index}
								sx={{
									display: "flex",
									justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
									mb: 1,
								}}
							>
								<Box
									sx={{
										maxWidth: "70%",
										p: 1,
										borderRadius: 1,
										bgcolor: msg.sender === "user" ? "primary.main" : "grey.300",
										color: msg.sender === "user" ? "white" : "black",
									}}
								>
									{msg.text}
								</Box>
							</Box>
						))}
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<TextField
							fullWidth
							size="small"
							placeholder="Type a message..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === "Enter") sendMessage();
							}}
						/>
						<IconButton onClick={sendMessage}>
							<SendIcon />
						</IconButton>
					</Box>
				</Paper>
			)}
			{!open && (
				<IconButton
					onClick={toggleChat}
					sx={{
						bgcolor: "primary.main",
						color: "white",
						"&:hover": { bgcolor: "primary.dark" },
					}}
				>
					<ChatBubbleOutlineIcon />
				</IconButton>
			)}
		</Box>
	);
};

export default ChatWidget;
