const http = require("http");
const multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");
const bodyParser = require("body-parser");
const server = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, ".", "qiepian");

function resolvePost(req) {
  return new Promise((resolve) => {
    let chunk = "";
    req.on("data", (data) => {
      //req接收到了前端的数据
      console.log(4);
      chunk += data;
    });
    req.on("end", () => {
      console.log(chunk);
      resolve(JSON.parse(chunk));
    });
  });
}

function pipeStream(path, writeStream) {
  return new Promise((resolve) => {
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });
}

server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    (res.status = 200), res.end();
    return;
  }
  if (req.url === "/upload") {
    const multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
      if (err) {
        return res.end("解析错误");
      }
      console.log("fields", fields);
      console.log("files=", files);
      const [file] = files.file;
      const [fileName] = fields.fileName;
      const [chunkName] = fields.chunkName;
      const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`);
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirs(chunkDir);
      }
      await fse.move(file.path, `${chunkDir}/${chunkName}`);
      res.end(
        JSON.stringify({
          code: 0,
          message: "切片上传成功",
        })
      );
    });
  }
});

server.on('request',async (req,res)=>{
	if (req.method === "OPTIONS") {
	  (res.status = 200), res.end();
	  return;
	}
	if (req.url === "/merge") {
		const data = await resolvePost(req);
		const { fileName, size } = data;
		const filePath = path.resolve(UPLOAD_DIR, fileName);
		await mergeFileChunk(filePath, fileName, size);
		res.end(
		  JSON.stringify({
			code: 0,
			message: "文件合成功",
		  })
		);
	  }
})

server.on('request',async(req,res)=>{
	if(req.src==='jsonre'){
		res.end('ok')
	}
})

async function mergeFileChunk(filePath, fileName, size) {
  const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`);
  let chunkPaths = await fse.readdir(chunkDir);
  chunkPaths.sort((a, b) => {
    a.split("-")[1] - b.split("-")[1];
  });
  const arr = chunkPaths.map((chunkPath, index) => {
    return pipeStream(
      path.resolve(chunkDir, chunkPath),
      fse.createWriteStream(filePath, {
        start: index * size,
        end: (index + 1) * size,
      })
    );
  });
  await Promise.all(arr);
}

server.listen(400, () => {
  console.log("项目启动test");
});
