var layout = function(res, data, blocks, callback){

	var blockNames = Object.keys(blocks);
	if(blockNames.length==0){
		callback(data);
	}
	else{
		var blockName = blockNames[0];
		var block = blocks[blockName];
		delete blocks[blockName];

		if(block.block==undefined || typeof block.block != "string"){
			throw "Block "+blockName+" must have a block attribute of type string";
		}

		var rd = block.data;
		if(rd==undefined){
			rd = {};
		}

		res.render(block.block, rd, function(err, html){
			if(err){
				throw err;
			}

			data[blockName] = html;
			layout(res, data, blocks, callback);
		});

	}
}

module.exports.express = function(req, res, next){


	res.layout = function(layout_file, data, blocks, callback){
		if(data==undefined){
			res.render(layout_file);
			return;
		}

		if(blocks==undefined){
			res.render(layout_file, data);
			return;
		}
		else if(typeof blocks == "function"){
			res.render(layout_file, data, blocks);
			return;
		}
		else if(typeof blocks == "object"){
			layout(res, data, blocks, function(new_data){
				if(callback==undefined){
					res.render(layout_file, new_data);
				}
				else{
					res.render(layout_file, new_data, callback);
				}
			});
		}
		else {
			throw "Invalid Block Type";
		}
	}

	next();
}