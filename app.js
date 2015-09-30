var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var crypto = require('crypto');
var xss = require('xss');
var mongoose = require('mongoose');

var app = express();
var app_port = process.env.VCAP_APP_PORT || 3000;
if (process.env.VCAP_SERVICES) {
    var mongodb_service = JSON.parse(process.env.VCAP_SERVICES);
    var dburi = mongodb_service.mongodb[0].credentials.uri;
} else {
    var dburi = 'mongodb://127.0.0.1:27017/bookkeeper';
}

var db = mongoose.createConnection(dburi);
db.on('error', function(error) {
    console.log(error + " wtf");
});

var billSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    cid: {
        type: mongoose.Schema.ObjectId,
        ref: 'category'
    },
    price: {
        type: String
    },
    bday: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    },
    mark: {
        type: String
    },
    type: {
        type: String
    },
    bbid: {
        type: String
    },
    bid: {
        type: mongoose.Schema.ObjectId,
        ref: 'billList'
    }
});

var userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    bid: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});

var billListSchema = new mongoose.Schema({
    name: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});
var categorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    id: {
        type: String
    },
    type: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});


billListSchema.statics.findbyid = function(id, callback) {
    return this.model('billList').find({
        _id: id
    }, callback);
}


userSchema.statics.findbyusername = function(username, callback) {
    return this.model('user').findOne({
        username: username
    }, callback);
}

billSchema.statics.findbyid = function(id, callback) {
    return this.model('bill').findOne({
        _id: id
    }, callback);
}

billListSchema.statics.findbyid = function(id, callback) {
    return this.model('bill').findOne({
        _id: id
    }).exec(callback);
}

billSchema.statics.findbymonth = function(data, callback) {
    return this.model('bill').find({
        bbid: data.bid,
        bday: {$regex: data.month}
    }).populate('uid cid bid').exec(callback);
}

billSchema.statics.findbybid = function(bbid, callback) {
    return this.model('bill').find({
        bbid: bbid
    }).populate('uid cid bid').exec(callback);
}

billSchema.statics.all = function(callback) {
    return this.model('bill').find({}, callback);
}

categorySchema.statics.findbyType = function(type, callback) {
    return this.model('category').find({
        type: type
    }, callback);
}

// model
var billModel = db.model('bill', billSchema);
var userModel = db.model('user', userSchema);
var billListModel = db.model('billList', billListSchema);
var categoryModel = db.model('category', categorySchema);


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));
// for parsing application/x-www-form-urlencoded
app.use(multer({
    dest: './uploads/'
}).single('photo'));
app.use(express.static('public'));

//xss felter
xss.whiteList['p'] = ['class', 'style'];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/add/billlist', function(req, res) {
    var name = req.query.name;

    db = mongoose.createConnection(dburi);

    db.on('error', function(error) {
        console.log(error + " wtf");
    });

    var doc = {
        name: name
    };

    billListModel.create(doc, function(error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }

        db.close();
    });


});


//category

app.get('/add/category', function(req, res) {
    var name = req.query.name;
    var type = req.query.type;
    var id = req.query.id;

    db = mongoose.createConnection(dburi);

    db.on('error', function(error) {
        console.log(error + " wtf");
    });

    var doc = {
        name: name,
        id: id,
        type: type
    };

    categoryModel.create(doc, function(error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }

        db.close();
    });


});

app.get('/change/category/:id', function(req, res) {
    var tid = req.params.id;
    var id = req.query.id;
    var name = req.query.name;

    db = mongoose.createConnection(dburi);

    var category = {
        _id: tid
    };
    var update = {
        $set: {
            id: id,
            name: name
        }
    };
    var options = {
        upsert: true
    };
    categoryModel.update(category, update, options, function(error) {
        if (error) {
            console.log(error);
        } else {
            res.send('update ok!');
        }
        //关闭数据库链接
        db.close();
    });

})

app.get('/del/category/:id', function(req, res) {
    var id = req.params.id;
    db = mongoose.createConnection(dburi);
    var category = {
        _id: id
    };
    categoryModel.remove(category, function(error) {
        if (error) {
            console.log(error);
        } else {
            res.send('delete ok!');
        }
        //关闭数据库链接
        db.close();
    });
})

app.get('/get/category/:type', function(req, res) {
    var list = [];
    db = mongoose.createConnection(dburi);

    categoryModel.findbyType(req.params.type, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
        //关闭数据库链接
        db.close();
    });


});


//bill
app.get('/billlist/:id', function(req, res) {
    var bid = req.params.id;
    var month = req.query.month;
    month = month.substr(0,7);
    var data = {
        bid:bid,
        month:month
    }
    db = mongoose.createConnection(dburi);

    billModel.findbymonth(data, function(error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
        //关闭数据库链接
        db.close();
    });

});

app.get('/all/bill', function(req, res) {

    db = mongoose.createConnection(dburi);
    billModel.all(function(error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
        db.close();
    });
})

app.get('/del/bill/:id', function(req, res) {
    var id = req.params.id;
    db = mongoose.createConnection(dburi);
    var bill = {
        _id: id
    };
    billModel.remove(bill, function(error) {
        if (error) {
            res.send({
                error:true
            });
        } else {
            res.send({
                error:false
            });
        }
        db.close();
    });
})

app.post('/change/bill', function(req, res) {

    var post = req.body;

    db = mongoose.createConnection(dburi);

    var bill= {
        _id: post.id
    };
    var update = {
        $set: {
            cid: post.cid,
            price: post.price,
            bday: post.bday,
            mark: post.mark,
            type: post.type
        }
    };
    var options = {
        upsert: true
    };
    billModel.update(bill, update, options, function(error,result) {
        if (error) {
            res.send({
                error:true,
                data:error
            });
        } else {
            res.send({
                error:false,
                post:post,
                data:result
            });
        }
        //关闭数据库链接
        db.close();
    });
})

app.post('/add/bill', function(req, res) {
    var post = req.body;
    post.text = xss(post.text);

    db = mongoose.createConnection(dburi);

    db.on('error', function(error) {
        console.log(error + " wtf");
    });
    var bill = {
        uid: post.uid,
        cid: post.cid,
        price: post.price,
        bday: post.bday,
        bbid: post.bid,
        bid: post.bid,
        mark: post.mark,
        type: post.type
    };
    //for (j = 0; j < covsession.length; j++) {
    //  if (covsession[j].username == post.author && covsession[j].sid == post.token) {
    billModel.create(bill, function(error, result) {
        if (error) {
            res.send(error);
        } else {
            console.log(result);
            res.send(result);
        }

        db.close();
    });
    // }
    //}
});

app.get('/bill/:id', function(req, res) {
    db = mongoose.createConnection(dburi);
    // 基于静态方法的查询
    billModel.findbyid(req.params.id, function(error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
        //关闭数据库链接
        db.close();
    });
});

app.post('/change', function(req, res) {
    var post = req.body;
    post.text = xss(post.text);
    db = mongoose.createConnection(dburi);


    var conditions = {
        _id: post.id
    };
    var update = {
        $set: {
            title: post.title,
            content: post.content
        }
    };
    var options = {
        upsert: true
    };
    for (j = 0; j < covsession.length; j++) {
        if (covsession[j].username == post.author && covsession[j].sid == post.token) {

            postModel.findbyid(post.id, function(error, result) {
                if (error) {
                    res.send(error);
                } else {
                    if (result[0].author != post.author) {
                        return res.send({
                            error: true,
                            msg: "不要玩我！"
                        });
                    }
                }
                db.close();
            });

            postModel.update(conditions, update, options, function(error) {

                db.close();
                if (error) {
                    return res.send({
                        error: true,
                        msg: error
                    });
                } else {
                    return res.send({
                        error: false
                    });
                }

            });

        } else if (j == covsession.length) {
            return res.send({
                error: true,
                msg: "不要玩我！"
            });
        }
    }

});


app.post('/login', function(req, res) {
    var user = req.body;
    if (!user.username || !user.username) {
        return res.send({
            error: true
        });
    }

    db = mongoose.createConnection(dburi);

    userModel.findbyusername(user.username, function(error, result) {
        if (error) {
            db.close();
            return res.send(error);
        } else {
            if (result == null) {
                return res.send({
                    error: true,
                    msg:"查无此人"
                });
            }
            if (result.password == user.password) {
                var md5 = crypto.createHash('md5');
                var thistime = new Date();
                md5.update(thistime + '23232322333');
                var d = md5.digest('hex');
                for (j = 0; j < covsession.length; j++) {
                    if (covsession[j].username == user.username) {
                        covsession.splice(j, 1);
                    }
                }
                covsession.push({
                    sid: d,
                    username: user.username
                })
                console.log(covsession);
                db.close();
                return res.send({
                    error: false,
                    data: {
                        token: d,
                        username: result.username,
                        uid: result.id,
                        bid: result.bid
                    }
                });
            }
        }
    });
});

app.post('/signin', function(req, res) {
    var user = req.body;

    db = mongoose.createConnection(dburi);

    userModel.findbyusername(user.username, function(error, result) {
        if (error) {
            res.send(error);
        } else {
            if (result != null) {
                //关闭数据库链接
                db.close();
                res.send({
                    error: true,
                    msg: "opps!this name was signed"
                });
            } else {
                var blist = {
                    name: '默认记账本'
                }

                billListModel.create(blist, function(error, blist) {
                    db.close();
                    if (error) {
                        res.send(error);
                    } else {
                        var doc = {
                            name: user.username,
                            username: user.username,
                            password: user.password,
                            bid: blist._id
                        };
                        userModel.create(doc, function(error) {
                            db.close();
                            if (error) {
                                res.send(error);
                            } else {
                                res.send({
                                    error: false,
                                    msg: "ok!"
                                });
                            }

                        });
                    }

                });

            }
        }

    });



});

var covsession = new Array;


var server = app.listen(app_port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('cov blog app listening at http://%s:%s', host, port);
});
