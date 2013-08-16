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
                    width: 100,
                    height: 75
                },{
                    src: '/assets/images/burger/2.png',
                    width: 100,
                    height: 83
                },{
                    src: '/assets/images/burger/3.png',
                    width: 100,
                    height: 81
                },{
                    src: '/assets/images/burger/4.png',
                    width: 100,
                    height: 74
                }
            ]

        function Game() {
            var space = this.space = new cp.Space()
            space.iterations = 60
            space.gravity = v(0, -100);
            space.sleepTimeThreshold = 0.5
            space.collisionSlop = 0.5
            space.sleepTimeThreshold = 0.5

            var canvas = this.canvas = document.getElementById('canvas')
                ,ctx = this.ctx = canvas.getContext('2d')
                ,me = this

            this.deadBurgerCount = 0
            this.score = 0
            this.inDish = []

            this.floor = this.addFloor()
            this.addWalls()
            this.dish = this.addDish()

            this.initKeyNav()
            this.initCollisionHandler()
        }

        Game.prototype = {
            width: 588
            ,height: 614
            ,burgerMass: 10
            ,burgerElasticity: .4
            ,burgerFriction: .3
            ,deadBurgerLimit: 5

            ,canvas2point: function(x, y) {
                return v(x, this.height - y)
            }

            ,point2canvas: function(point) {
                return v(point.x, this.height - point.y)
            }

            ,run: function() {
                if (!this.assetsLoaded) {
                    this.images = {
                        '/assets/images/burger/1.png': null,
                        '/assets/images/burger/2.png': null,
                        '/assets/images/burger/3.png': null,
                        '/assets/images/burger/4.png': null
                    }

                    var loader = new PxLoader()
                    for (var i in this.images) {
                        loader.addImage(i)
                    }

                    var me = this

                    loader.addCompletionListener(function() {
                        for (var i in me.images) {
                            me.images[i] = new Image()
                            me.images[i].src = i
                        }
                        me.assetsLoaded = true
                        me.run()
                    })

                    loader.start()
                    return this
                }

                this.running = true
                var me = this

                this.addBurger()

                var lastTime = 0
                var step = function(time) {
                    me.step(time - lastTime)
                    lastTime = time

                    if (me.running) {
                        raf(step)
                    }
                };

                this.updatePlayTime()
                step(0)
            }

            ,addFloor: function() {
                var space = this.space
                    ,floor = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(this.width, 0), 0))
                floor.setElasticity(.1)
                floor.setFriction(1)
                floor.setLayers(NOT_GRABABLE_MASK)
                floor.noRender = true
                floor.type = 'floor'

                return floor
            }

            ,addWalls: function() {
                var space = this.space
                    ,wall1 = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(0, this.height), 0))
                    ,wall2 = space.addShape(new cp.SegmentShape(space.staticBody, v(this.width, 0), v(this.width, this.height), 0))

                wall1.setElasticity(.1)
                wall1.setFriction(1)
                wall1.setLayers(NOT_GRABABLE_MASK)
                wall1.noRender = true


                wall2.setElasticity(.1)
                wall2.setFriction(1)
                wall2.setLayers(NOT_GRABABLE_MASK)
                wall2.noRender = true
            }

            ,addDish: function() {
                var space = this.space
                    ,width = 100
                    ,height = 20
                    ,left = this.width / 2 - width / 2
                    ,disk = space.addShape(new cp.BoxShape2(space.staticBody, new cp.BB(left, 0, left + width, height)))

                disk.setElasticity(.1)
                disk.setFriction(1)
                disk.type = 'disk'

                return disk
            }

            ,addBurger: function() {
                if (this.endGame) {
                    return this
                }

                var me = this
                    ,space = this.space
                    ,burger = Random.item(burgers)
                    ,width = burger.width - 4
                    ,height = burger.height - 4
                    ,body = new cp.Body(this.burgerMass, cp.momentForBox(this.burgerMass, width, height))
                    ,shape = new cp.BoxShape(body, width, height)

                body.setPos(v(Random(width / 2, this.width -width / 2), this.height + height))
                shape.setElasticity(this.burgerElasticity)
                shape.setFriction(this.burgerFriction)
                shape.type = 'burger'
                shape.imageSrc = burger.src

                if (!space.isLocked()) {
                    space.addBody(body)
                    me.currentBurger = space.addShape(shape)
                } else {
                    space.addPostStepCallback(function() {
                        space.addBody(body)
                        me.currentBurger = space.addShape(shape)
                    })
                }
            }

            ,removeBurger: function(burger) {
                if (!burger.timeoutRemoveId) {
                    var space = this.space
                    this.removeFromDish(burger)

                    burger.dead = true
                    this.deadBurgerCount++
                    $('.lifeNum').find('li:eq(' + (this.deadBurgerCount - 1) + ')').append('<span class="loose"></span>')

                    if (this.deadBurgerCount >= this.deadBurgerLimit) {
                        this.calculateScore()
                    }

                    if (burger == this.currentBurger) {
                        this.addBurger()
                    }

                    if (!space.isLocked()) {
                        space.removeBody(burger.body)
                    } else {
                        space.addPostStepCallback(function() {
                            space.removeBody(burger.body)
                        })
                    }

                    burger.timeoutRemoveId = setTimeout(function() {
                        var removeCallback = function() {
                            clearInterval(burger.timeoutRemoveId)
                            burger.timeoutRemoveId = null
                            space.removeShape(burger)
                        }

                        if (!space.isLocked()) {
                            removeCallback()
                        } else {
                            space.addPostStepCallback(removeCallback)
                        }
                    }, 2000)
                }
            }

            ,initKeyNav: function() {
                var me = this
                this.moveScale = 1

                $(window).on({
                    keydown: function(e) {
                        if (e.keyCode == 37) {
                            me.moveLeft()
                        } else if (e.keyCode == 39) {
                            me.moveRight()
                        }
                    }
                    ,keyup: function() {
                        me.moveScale = 1
                    }
                })
            }

            ,initCollisionHandler: function() {
                var me = this
                this.space.setDefaultCollisionHandler(null, null, function(arbiter, space) {
                    var a = arbiter.a
                        ,b = arbiter.b
                        ,floor
                        ,disk
                        ,burger

                    switch (a.type + '-' + b.type) {
                        case 'floor-burger':
                            me.removeBurger(b)
                            break

                        case 'burger-floor':
                            me.removeBurger(a)
                            break

                        case 'dish-burger':
                            me.addToDish(b)
                            break
    //
                        case 'burger-dish':
                            me.addToDish(a)
                            break
    //
                        case 'burger-burger':
                            if (-1 == me.inDish.indexOf(a) && -1 != me.inDish.indexOf(b)) {
                                me.addToDish(a)
                            }

                            if (-1 == me.inDish.indexOf(b) && -1 != me.inDish.indexOf(a)) {
                                me.addToDish(b)
                            }
                    }
                })
            }

            ,addToDish: function(burger) {
                if (burger != this.currentBurger) {
                    return this
                }

                if (-1 !== this.inDish.indexOf(burger)) {
                    return this
                }

                this.addBurger()

                this.inDish.push(burger)
                return this
            }

            ,removeFromDish: function(burger) {
                var index = this.inDish.indexOf(burger)
                if (-1 != index) {
                    this.inDish.splice(index, 1)
                }
                return this
            }

            ,calculateScore: function() {
                if (this.endGame) {
                    return
                }

                this.endGame = true
                var me = this
                var intervalId = setInterval(function() {
                    if (0 == me.space.activeShapes.count) {
                        clearInterval(intervalId)
                        me.running = false

                        var score = 0
                        for (var i = 0; i < me.inDish.length; i++) {
                            me.addScoreAffect(i + 1, me.inDish[i].body.getPos())
                            score += i + 1
                        }
                    }
                }, 100)

            }

            ,updatePlayTime: function() {
                var me = this
                    ,now = Date.now()
                    ,totalTimeSeconds = 0
                    ,s = 0
                    ,h = 0
                    ,m = 0

                this.updatePlayTimeInterval = setInterval(function() {
                    totalTimeSeconds++
                    m = Math.round(totalTimeSeconds / 60)
                    h = Math.round(m / 60)
                    m = m % 60
                    s = totalTimeSeconds % 60

                    h = ('0' + h).substr(-2)
                    m = ('0' + m).substr(-2)
                    s = ('0' + s).substr(-2)

                    $('.timming .numOutline').text([h, m, s].join(':'))
                    if (me.endGame) {
                        clearInterval(me.updatePlayTimeInterval)
                    }
                }, 1000)
            }

            ,addScoreAffect: function(score, pos) {
                pos = this.point2canvas(pos)
                if (!this.scoreAffects) {
                    this.scoreAffects = []
                }

                this.scoreAffects.push({
                    score: score
                    ,x: pos.x
                    ,y: pos.y
                })

                if (!this.isRunningScoreAffect) {
                    this.isRunningScoreAffect = true
                    var me = this
                        ,$totalScore = $('.totalScore .numOutline')

                    function run() {
                        var affect = me.scoreAffects.shift()
                        if (affect) {
                            $('<div class="score"></div>')
                                .text('+' + affect.score)
                                .css({top: affect.y - 100/2, left: affect.x - 119 / 2})
                                .appendTo('#playStage')
                                .fadeOut(0)
                                .fadeIn(500)
                                .delay(500).animate({opacity: 0, top: '-=100'}, 2000, function() {
                                    run()
                                })

                            $('.burgerKind ul').prepend('<li><span class="icon Burger01"></span>' + affect.score + '</li>')
                            $totalScore.text(parseInt($totalScore.text()) + affect.score)
                        } else {
                            me.isRunningScoreAffect = false
                        }
                    }

                    run()
                }
            }

            ,moveLeft: function() {
                var pos = this.currentBurger.body.getPos()
                pos.x -= 2 * this.moveScale
                this.moveScale += 1
            }

            ,moveRight: function() {
                var pos = this.currentBurger.body.getPos()
                pos.x += 2 * this.moveScale
                this.moveScale += 1
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
                    ,ctx = this.ctx

                // Draw shapes
                ctx.strokeStyle = 'black'
                ctx.clearRect(0, 0, this.width, this.height)

                this.space.eachShape(function(shape) {
    //                ctx.fillStyle = shape.style()
                    shape.draw(me)
                });
            }
        };

        var drawLine = function(app, a, b) {
            a = app.point2canvas(a)
            b = app.point2canvas(b)

            app.ctx.beginPath()
            app.ctx.moveTo(a.x, a.y)
            app.ctx.lineTo(b.x, b.y)
            app.ctx.stroke()
        };

        cp.SegmentShape.prototype.draw = function(app) {
            if (this.noRender) {
                return
            }
            var ctx = app.ctx
                ,oldLineWidth = ctx.lineWidth;

            ctx.lineWidth = Math.max(1, this.r * 2)
            drawLine(app, this.ta, this.tb)
            ctx.lineWidth = oldLineWidth
        }

        cp.PolyShape.prototype.draw = function(app) {
            var ctx = app.ctx
                ,verts = this.tVerts
                ,len = verts.length
                ,lastPoint = app.point2canvas(cp.v(verts[len - 2], verts[len - 1]))

            if (this.imageSrc) {
                var angle = -cp.v.toangle(this.body.rot)
                    ,image = app.images[this.imageSrc]
                    ,width = image.width
                    ,height = image.height
                ctx.save()

                if (this.dead) {
                    this.opacity || (this.opacity = 1)
                    this.opacity -= 1/120
                    ctx.globalAlpha = this.opacity
                }

                ctx.translate(lastPoint.x, lastPoint.y)
                ctx.rotate(angle)
                ctx.drawImage(
                    image,
                    -width,
                    -height
                )
                ctx.restore()
                return
            }

            ctx.beginPath()

            var verts = this.tVerts
                ,len = verts.length
                ,lastPoint = app.point2canvas(v(verts[len - 2], verts[len - 1]))
            ctx.moveTo(lastPoint.x, lastPoint.y)

            for(var i = 0; i < len; i += 2){
                var p = app.point2canvas(v(verts[i], verts[i+1]))
                ctx.lineTo(p.x, p.y)
            }
            ctx.fill()
            ctx.stroke()
        };

        (new Game()).run()
    })()