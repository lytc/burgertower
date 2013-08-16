(function() {
    var raf = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
        ,v = cp.v
        ,GRABABLE_MASK_BIT = 1<<31
        ,NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT
        ,burgers = [
            {
                src: '/assets/images/burger/1.png',
                name: 'burger1',
                width: 80,
                height: 55
            },{
                src: '/assets/images/burger/2.png',
                name: 'burger2',
                width: 80,
                height: 55
            },{
                src: '/assets/images/burger/3.png',
                name: 'burger3',
                width: 80,
                height: 55
            },{
                src: '/assets/images/burger/4.png',
                name: 'burger4',
                width: 80,
                height: 55
            }
        ]

    function Game() {
        var space = this.space = new cp.Space()
        space.iterations = 60
        space.gravity = v(0, -50);
        space.sleepTimeThreshold = 0.5
        space.collisionSlop = 0
        space.sleepTimeThreshold = 0.5


        this.stage = new PIXI.Stage()
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, null, true)
//        this.renderer = new PIXI.CanvasRenderer(this.width, this.height, null, true)
        $('#playStage').append(this.renderer.view)

        this.deadBurgerCount = 0
        this.inDish = []
        this.scores = []
        this.totalScore = 0
        this.totalSuccessBurgers = 0

        this.floor = this.addFloor()
        this.dish = this.addDish()

        this.initializeMouse()
        this.initializeCollisionHandler()
        this.initializePlayTime()
    }

    Game.prototype = {
        width: 588
        ,height: 550

        ,burgerMass: .1
        ,burgerElasticity: 0
        ,burgerFriction: 1

        ,springStiffness: 20
        ,springDamping: 1

        ,deadBurgerLimit: 5
        ,offsetHeight: 0

        ,canvas2point: function(x, y) {
            return v(x, this.height - y + this.offsetHeight)
        }

        ,point2canvas: function(point) {
            return v(point.x, this.height - point.y + this.offsetHeight)
        }

        ,toDeg: function(rad) {
            return rad * 180 / Math.PI
        }

        ,toRad: function(deg) {
            return deg * Math.PI / 180
        }

        ,run: function() {
            if (!this.assetsLoaded) {
                this.images = {
                    '/assets/images/burger/1.png': null,
                    '/assets/images/burger/2.png': null,
                    '/assets/images/burger/3.png': null,
                    '/assets/images/burger/4.png': null,
                    '/assets/images/home_bgn.jpg': null,
                    '/assets/images/city.png': null,
                    '/assets/images/cloud01.png': null,
                    '/assets/images/cloud02.png': null,
                    '/assets/images/cloud03.png': null,
                    '/assets/images/face_icon.png': null,
                    '/assets/images/kfc_logo.png': null,
                    '/assets/images/life.png': null,
                    '/assets/images/loose.png': null,
                    '/assets/images/playElement.png': null,
                    '/assets/images/playScene.png': null,
                    '/assets/images/burger01.png': null
                }

                var loader = new PxLoader()
                for (var i in this.images) {
                    loader.addImage(BASE_URL + i)
                }

                var me = this

                loader.addCompletionListener(function() {
                    for (var i in me.images) {
                        me.images[i] = new Image()
                        me.images[i].src = BASE_URL + i
                    }

                    me.assetsLoaded = true

                    $.post(BASE_URL + '/play/start', function() {
                        me.run()
                    })
                })

                loader.start()
                return this
            }

            this.running = true
            var me = this

            var stats = new Stats();

            stats.domElement.style.position = 'fixed'
            stats.domElement.style.right = 0
            stats.domElement.style.top = 0
            document.body.appendChild(stats.domElement)

            this.addBurger()

            var lastTime = 0
            var step = function(time) {
                me.step(time - lastTime)
                lastTime = time

                if (me.running) {
                    stats.update()
                    raf(step)
                }
            };

            step(0)
        }

        ,update: function(dt) {
            this.space.step(dt)
        }

        ,step: function(dt) {
            var lastNumActiveShapes = this.space.activeShapes.count
            this.update(1/60)

            if (lastNumActiveShapes > 0) {
                this.draw()
            }
        }

        ,draw: function() {
            var me = this
            this.space.eachShape(function(shape) {
                !shape.draw || shape.draw(me)
            })

            this.renderer.render(this.stage)
            this.drawScore()
        }

        ,drawScore: function() {
            var me = this

            $.each(this.scores, function(index, score) {
                if (!score.draw) {
                    score.pos.x -= 50
                    score.opacity = 1
                    var sprite
                    score.draw = function() {
                        if (!this.text) {
                            sprite = this.text = new PIXI.Text('+' + score.score, {font: 'bold 80px Oxydesign', fill: '#900', stroke: "#F90", strokeThickness: 6})
                            sprite.position.x = score.pos.x
                            sprite.position.y = score.pos.y
                            me.stage.addChild(sprite)
                        }
                        this.text.position.y -= 1.5
                        this.text.alpha -= 1 / 90
                    }
                    setTimeout(function() {
                        me.scores.splice(index, 1)
                        me.stage.removeChild(sprite)
                    }, 1500)
                }

                score.draw()
            })
        }

        ,addFloor: function() {
            var space = this.space
                ,floor = space.addShape(new cp.SegmentShape(space.staticBody, v(-this.width, 0), v(this.width * 2, 0), 0))
            floor.setElasticity(.1)
            floor.setFriction(1)
            floor.setLayers(NOT_GRABABLE_MASK)
            floor.draw = false
            floor.type = 'floor'

            return floor
        }

        ,addDish: function() {
            var space = this.space
                ,width = 80
                ,height = 50
                ,left = this.width / 2
                ,body = space.addBody(new cp.Body(5, cp.momentForBox(5, width, height)))
                ,dish = space.addShape(new cp.BoxShape(body, width, height))

            body.setPos(v(left, height / 2))
            dish.setElasticity(0)
            dish.setFriction(.5)
            dish.type = 'dish'
            dish.imageSrc = '/assets/images/burger/1.png'
            dish.width = width
            dish.height = height

            space.addConstraint(new cp.GrooveJoint(this.floor.body, body, v(-this.width * 2, height / 2), v(this.width * 2, height / 2), v(0, 0)))

            return dish
        }

        ,addBurger: function() {
            if (this.gameOver) {
                return this
            }

            $.post(BASE_URL + '/play/update', {'new': 76545})

            var me = this
                ,space = this.space
                ,burger = Random.item(burgers)
                ,width = burger.width - 4
                ,height = burger.height - 4
                ,body = new cp.Body(this.burgerMass, cp.momentForBox(this.burgerMass, width, height))
                ,shape = new cp.BoxShape(body, width, height)

            body.setPos(v(Random(width / 2, this.width -width / 2), this.height + height + this.offsetHeight))
            shape.setElasticity(this.burgerElasticity)
            shape.setFriction(this.burgerFriction)
            body.setVel(v(0, - Math.random() * 50))

            shape.type = 'burger'
            shape.imageSrc = burger.src
            shape.name = burger.name
            shape.width = width
            shape.height = height

            this.addPostStepCallback(function() {
                space.addBody(body)
                me.currentBurger = space.addShape(shape)
            })
        }

        ,removeBurger: function(burger) {
            $.post(BASE_URL + '/play/update', {loose: 9841})

            burger.dead = true
            this.deadBurgerCount++

            var me = this
            setTimeout(function() {
                me.addPostStepCallback(function() {
                    me.space.removeBody(burger.body)
                    me.space.removeShape(burger)
                    me.stage.removeChild(burger.sprite)
                })
            }, 2000)

            if (this.deadBurgerCount >= this.deadBurgerLimit) {
                this.endGame()
            }

            $('.lifeNum').find('li:eq(' + (this.deadBurgerCount - 1) + ')').append('<span class="loose"></span>')

            return this
        }

        ,initializeMouse: function() {
            var me = this
                ,mouseBody = new cp.Body(Infinity, Infinity)
                ,dishBody = this.dish.body
                ,mouseJoint = self.mouseJoint = new cp.PivotJoint(mouseBody, dishBody, v(0,0), v(0, 0))
            mouseBody.setPos(v(this.width / 2, 10))
            mouseJoint.maxForce = 50000
            mouseJoint.errorBias = Math.pow(1 - 0.15, 60)
            this.space.addConstraint(mouseJoint)

            $(this.renderer.view).on('mousemove', function(e) {
                if (me.gameOver) {
                    return
                }
                mouseBody.p.x = e.clientX - $(me.renderer.view).offset().left
            })
        }

        ,initializeCollisionHandler: function() {
            var me = this

            this.space.setDefaultCollisionHandler(function(arbiter, space) {
                var a = arbiter.a
                    ,b = arbiter.b

                if ((a.dead || b.dead) && ('burger' == a.type || 'burger' == b.type)) {
                    switch (a.type + '-' + b.type) {
                        case 'burger-dish':
                        case 'dish-burger':
                        case 'burger-burger':
                            return false
                    }
                }
                return true

            }, null, function(arbiter, space) {
                var a = arbiter.a
                    ,b = arbiter.b

                if (a.dead || b.dead || (a.type != 'burger' && b.type != 'burger') || (a.inDish && b.inDish)) {
                    return
                }

                switch (a.type + '-' + b.type) {
                    case 'burger-floor':
                        a = arbiter.b
                        b = arbiter.a
                    case 'floor-burger':
                        me.removeBurger(b)
                        break

                    case 'burger-dish':
                        a = arbiter.b
                        b = arbiter.a
                    case 'dish-burger':
                        if (v.dist(a.body.p, b.body.p) < 70 && !b.inDish) {
                            me.addToDish(b)
                            var dist = v.dist(a.body.p, b.body.p)
                                ,minDist = (a.height + b.height) / 2
                                ,offset = dist - minDist
                            me.addScore(offset, b.body.p)
                        }
                        break

                    case 'burger-burger':
                        if ((a.inDish || b.inDish) && (a == me.currentBurger || b == me.currentBurger)) {
                            if (b.inDish) {
                                var tmp = a
                                a = b
                                b = tmp
                            }

                            if (me.inDish.indexOf(a) != -1) {
                                var dist = v.dist(a.body.p, b.body.p)
                                if (dist < a.height / 2 + b.height / 2 + 20 && Math.abs(me.toDeg(a.body.a)) < 30) {
                                    me.addToDish(b)

                                    var minDist = (a.height + b.height) / 2
                                        ,offset = dist - minDist
                                    me.addScore(offset, b.body.p)
                                }
                            }
                        }
                }

                if (a == me.currentBurger || b == me.currentBurger) {
                    me.currentBurger = null
                    me.addBurger()
                }
            })
        }

        ,initializePlayTime: function() {
            var me = this
                ,startPlayTime

            setInterval(function() {
                if (!me.running) {
                    return
                }

                startPlayTime || (startPlayTime = (new Date).getTime())
                me.playTime = (new Date).getTime() - startPlayTime

                $('.timming .numOutline').text(me.getPlayTime(true))
            }, 1000)
        }

        ,addPostStepCallback: function(callback) {
            if (!this.space.isLocked()) {
                callback()
            } else {
                this.space.addPostStepCallback(callback)
            }
            return this
        }

        ,addToDish: function(burger) {
            if (this.gameOver || burger.inDish) {
                return this
            }

            var me = this

            burger.inDish = true

            // kind counter
            var $counter = $('.burgerKind .' + burger.name)
            $counter.text(parseInt($counter.text()) + 1)


            var a = this.inDish.length? this.inDish[this.inDish.length - 1] : this.dish
                ,b = burger

            var restLength = (a.height + b.height) / 1.5

                ,anchor1     = v(-a.width * 2, 0)
                ,anchor2    = v(-b.width, 0)
                ,joint1     = new cp.DampedSpring(a.body, b.body, anchor1, anchor2, restLength, this.springStiffness, this.springDamping)

                ,anchor3    = v(a.width * 2, 0)
                ,anchor4    = v(b.width, 0)
                ,joint2     = new cp.DampedSpring(a.body, b.body, anchor3, anchor4, restLength, this.springStiffness, this.springStiffness)

            joint1.errorBias = Math.pow(1 - .15, 60)
            joint2.errorBias = Math.pow(1 - .15, 60)

            joint1.preSolve = function() {
                if (Math.abs(me.toDeg(this.b.a)) > 30) {
                    me.addPostStepCallback(function() {
                        me.space.removeConstraint(joint1)
                        me.space.removeConstraint(joint2)
                    })
                    me.removeFromDish(this.b.shapeList[0])
                    me.endGame()
                }
            }

            this.addPostStepCallback(function() {
                me.space.addConstraint(joint1)
                me.space.addConstraint(joint2)
            })


            this.inDish.push(burger)

            this.updateOffsetHeight()
        }

        ,updateOffsetHeight: function(offsetHeight) {
            var me = this

            if (undefined === offsetHeight) {
                var totalBurgerHeight = 0

                for (var i = 0, len = this.inDish.length; i < len; i++) {
                    totalBurgerHeight += this.inDish[i].height
                }

                offsetHeight = totalBurgerHeight - 100
                if (offsetHeight < 0) {
                    offsetHeight = 0
                }

            }

            if (offsetHeight != this.offsetHeight) {
                var diff = offsetHeight - this.offsetHeight
                    ,step = diff / 60

                clearInterval(this.scaleOffsetIntervalId)
                this.scaleOffsetIntervalId = setInterval(function() {
                    me.offsetHeight += step

                    diff -= step
                    if (step > 0 && diff <= 0 || step < 0 && diff >= 0) {
                        clearInterval(me.scaleOffsetIntervalId)
                    }
                }, 1000 / 60)
            }
        }

        ,removeFromDish: function(burger) {
            burger.inDish = false
            this.inDish.splice(this.inDish.indexOf(burger), 1)

            this.updateOffsetHeight()
            return this
        }

        ,addScore: function(offset, pos) {
            if (this.gameOver) {
                return this
            }

            pos = this.point2canvas(pos)

            var score = 1
            if (offset < 2) {
                score = 5
            } else if (offset < 5) {
                score = 3
            }

            $.post(BASE_URL + '/play/update', {'score': score})

            this.totalSuccessBurgers++
            this.totalScore += score
            this.scores.push({score: score, pos: pos})

            $('.totalScore .numOutline').text(this.totalScore)
        }

        ,endGame: function() {
            if (this.gameOver) {
                return this
            }

            this.gameOver = true

            var me = this
                ,popup = $('#play-result')

            me.updateOffsetHeight(0)

            $.post(BASE_URL + '/play/end', function(result) {
                setTimeout(function() {
                    me.running = false
                    popup.show().fadeOut(0).fadeIn()
                    popup.find('.numScore').text(me.totalScore)
                    popup.find('.play-time').text(me.getPlayTime(result.time, true))
                    popup.find('.num-burger').text(me.totalSuccessBurgers)
                    popup.find('.share').one('click', function() {
                        FB.ui({
                            method: 'feed',
                            picture: 'https://www.vietbuzzad.net/tower/assets/images/coverShare.jpg',
                            name: 'KFC Vietnam - Burger Tower',
                            description: '??' + result.score
                        }, function(response) {})
                    })
                }, 1000)

                if (!result.registered) {
                    var $regPopup = $('#register')
                    $regPopup.fadeOut(0).fadeIn()

                    var $form = $regPopup.find('form')
                    $form.submit(function(e) {
                        e.preventDefault()
                        $regPopup.fadeOut()

                        $.post(BASE_URL + '/register', $form.serialize(), function() {

                        })
                    })
                }
            })

        }

        ,getPlayTime: function(time, friendly) {
            if ('boolean' == typeof time) {
                friendly = time
                time = this.playTime
            }

            if (!friendly) {
                return time
            }

            var s = Math.floor(this.playTime / 1000)
                ,m = Math.floor(s / 60)
                ,h = Math.floor(m / 60)

            m = m % 60
            s = s % 60

            h = ('0' + h).substr(-2)
            m = ('0' + m).substr(-2)
            s = ('0' + s).substr(-2)

            return [h, m, s].join(':')
        }
    }

    cp.SegmentShape.prototype.draw = function(app) {

    }

    cp.PolyShape.prototype.draw = function(app) {
        var verts = this.tVerts
            ,len = verts.length
            ,lastPoint = app.point2canvas(cp.v(verts[len - 2], verts[len - 1]))

        if (this.imageSrc) {
            if (!this.sprite) {
                this.sprite = PIXI.Sprite.fromImage(BASE_URL + this.imageSrc)
                this.sprite.anchor.x = 1
                this.sprite.anchor.y = 1
                app.stage.addChild(this.sprite)
            }

            this.sprite.rotation = -this.body.a
            this.sprite.position.x = lastPoint.x
            this.sprite.position.y = lastPoint.y

            if (this.dead) {
                this.opacity || (this.opacity = 1)
                this.opacity -= 1/120
                this.sprite.alpha = this.opacity
            }
        }
    };

    (new Game()).run()
})()