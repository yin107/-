const http = require("http");
const multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");
const bodyParser = require("body-parser");
const server = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, ".", "qiepian2");

const extractExt = (filename) =>
  filename.slice(filename.lastIndexOf("."), filename.length); //提取文件名

// 创建临时文件夹用于临时存储 chunk
// 添加 chunkDir 前缀与文件名做区分
// create a directory for temporary storage of chunks
// add the 'chunkDir' prefix to distinguish it from the chunk name
const getChunkDir = (fileHash) =>
  path.resolve(UPLOAD_DIR, `chunkDir_${fileHash}`);
//返回已经上传的所有切片名
const createUploadedList = async (fileHash) =>
  fse.existsSync(getChunkDir(fileHash))
    ? await fse.readdir(getChunkDir(fileHash))
    : [];

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


const resolvePost = (req) => {
	return new Promise((resolve) => {
	  let chunk = "";
	  req.on("data", (data) => {
		chunk += data;
	  });
	  req.on("end", () => {
		resolve(JSON.parse(chunk));
	  });
	});
  };
server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }
  if (req.url === "/") {
    const multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return;
      }
      const [chunk] = files.chunk;
      const [hash] = fields.hash;
      const [fileHash] = fields.fileHash;
      const [filename] = fields.filename;
      const filePath = path.resolve(
        UPLOAD_DIR,
        `${fileHash}${extractExt(filename)}`
      );
      //   const chunkDir = path.resolve(UPLOAD_DIR, "chunkDir" + filename);
      const chunkDir = getChunkDir(fileHash);
      const chunkPath = path.resolve(chunkDir, hash);
      // 文件存在直接返回
      // return if file is exists
      if (fse.existsSync(filePath)) {
        res.end("file exist");
        return;
      }
      // 切片存在直接返回
      // return if chunk is exists
      if (fse.existsSync(chunkPath)) {
        res.end("chunk exist");
        return;
      }

      // 切片目录不存在，创建切片目录
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirs(chunkDir);
      }

      await fse.move(chunk.path, path.resolve(chunkDir,hash));
      res.end(
        JSON.stringify({
          code: 0,
          message: "切片上传成功",
        })
      );
    });
  }
});


const mergeFileChunk = async (filePath, fileHash, size) => {
  //此时改成了根据fileHash而不是filename
  //   const chunkDir = path.resolve(UPLOAD_DIR, "chunkDir" + filename);
  const chunkDir = getChunkDir(fileHash);
  // 根据切片下标进行排序
  // 否则直接读取目录的获得的顺序会错乱
  const chunkPaths = await fse.readdir(chunkDir);
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        fse.createWriteStream(filePath, { start: index * size })
      )
    )
  );
  fse.rmdirSync(chunkDir);
};

server.on("request", async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }
  if (req.url === "/merge") {
    const data = await resolvePost(req);
    const { fileHash, filename, size } = data;
    const ext = extractExt(filename);
    // const filePath = path.resolve(UPLOAD_DIR, `${filename}`);
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`);
    await mergeFileChunk(filePath, fileHash, size);
    res.end(
      JSON.stringify({
        code: 0,
        mess: "success",
      })
    );
  }
});

server.on("request", async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }
  if (req.url === "/verify") {
    const data = await resolvePost(req);
    const { fileHash, filename } = data;
    const ext = extractExt(filename);
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`);
    if (fse.existsSync(filePath)) {
      res.end(JSON.stringify({ shouldUpload: false }));
    } else {
      res.end(
        JSON.stringify({
          shouldUpload: true,
          uploadedList: await createUploadedList(fileHash),
        })
      );
    }
  }
  if(req.url==='/delete'){//整个切片文件夹全部删除
	await fse.remove(path.resolve(UPLOAD_DIR))
	res.end(
		JSON.stringify({
			code:0,
			message:'删除所有文件成功'
		})
	)
  }





});


server.on('request', async (req,res)=>{
	  //测试await并发请求
	  if(req.url==='/test'){
	
		res.end(JSON.stringify({
			data:'成功啦'
		}))
	  }
	  if(req.url==='/test2'){
		res.statusCode = 401
		res.end(JSON.stringify({data:'失败啦'})) 
	  }
})





server.listen(401, () => {
  console.log("项目启动test");
});
