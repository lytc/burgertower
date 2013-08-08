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
        space.collisionSlop = 0
        space.sleepTimeThreshold = 0.5

        var canvas = this.canvas = document.getElementById('canvas')
            ,ctx = this.ctx = canvas.getContext('2d')

        this.deadBurgerCount = 0
        this.inDisk = []
        this.scores = []
        this.totalScore = 0
        this.totalSuccessBurgers = 0

        this.floor = this.addFloor()
        this.disk = this.addDisk()

        this.initializeMouse()
        this.initializeCollisionHandler()
        this.initializePlayTime()
    }

    Game.prototype = {
        width: 588
        ,height: 614
        ,burgerMass: 3
        ,burgerElasticity: .2
        ,burgerFriction: 1
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
                    loader.addImage(i)
                }

                var me = this

                loader.addCompletionListener(function() {
                    for (var i in me.images) {
                        me.images[i] = new Image()
                        me.images[i].src = i
                    }

                    me.assetsLoaded = true

                    $.post('/play/start', function() {
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
                ,ctx = this.ctx

            // Draw shapes
//            ctx.strokeStyle = 'black'
            ctx.clearRect(0, 0, this.width, this.height)

            this.space.eachShape(function(shape) {
                shape.draw(me)
            })

            this.drawScore()
        }

        ,drawScore: function() {
            var me = this
                ,ctx = me.ctx

            $.each(this.scores, function(index, score) {
                if (!score.draw) {
                    score.pos.x -= 50
                    score.opacity = 1
                    score.draw = function() {
                        ctx.save()
                        ctx.font = 'bold 80px Oxydesign'
                        ctx.fillStyle = '#900'
                        ctx.globalAlpha = score.opacity


                        var text = '+' + score.score
                            ,blur = 20

                        ctx.textBaseline = 'top'
                        ctx.shadowColor = '#F90'
                        ctx.shadowOffsetX = 0
                        ctx.shadowOffsetY = 0
                        ctx.shadowBlur = blur
                        ctx.fillText(text, score.pos.x, score.pos.y)
                        ctx.restore()
                        score.pos.y -= 1.5
                        score.opacity -= 1 / 90
                    }
                    setTimeout(function() {
                        me.scores.splice(index, 1)
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
            floor.noRender = true
            floor.type = 'floor'

            return floor
        }

        ,addDisk: function() {
            var space = this.space
                ,width = 100
                ,height = 20
                ,left = this.width / 2
                ,body = space.addBody(new cp.Body(5, cp.momentForBox(5, width, height)))
                ,disk = space.addShape(new cp.BoxShape(body, width, height))

            body.setPos(v(left, height / 2))
            disk.setElasticity(0)
            disk.setFriction(.5)
            disk.type = 'disk'
            disk.width = width
            disk.height = height

            space.addConstraint(new cp.GrooveJoint(this.floor.body, body, v(-this.width, 10), v(this.width * 2, 10), v(0, 0)))

            return disk
        }

        ,addBurger: function() {
            if (this.gameOver) {
                return this
            }

            $.post('/play/update', {'new': 76545})

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
            shape.type = 'burger'
            shape.imageSrc = burger.src
            shape.width = width
            shape.height = height

            this.addPostStepCallback(function() {
                space.addBody(body)
                me.currentBurger = space.addShape(shape)
            })
        }

        ,removeBurger: function(burger) {
            $.post('/play/update', {loose: 9841})

            burger.dead = true
            this.deadBurgerCount++

            var me = this
            setTimeout(function() {
                me.addPostStepCallback(function() {
                    me.space.removeBody(burger.body)
                    me.space.removeShape(burger)
                })
            }, 2000)

            if (this.deadBurgerCount >= this.deadBurgerLimit) {
                this.endGame()
            }

            $('.lifeNum').find('li:eq(' + (this.deadBurgerCount - 1) + ')').append('<span class="loose"></span>')

            return this
        }

        ,initializeMouse: function() {
//            this.mouse = v(this.width / 2, 0)

            var me = this
                ,mouseBody = this.mouseBody = new cp.Body(Infinity, Infinity)
                ,diskBody = this.disk.body
                ,mouseJoint = self.mouseJoint = new cp.PivotJoint(mouseBody, diskBody, v(0,0), v(0, 0))
            mouseBody.setPos(v(this.width / 2, 10))
            mouseJoint.maxForce = 50000
            mouseJoint.errorBias = Math.pow(1 - 0.15, 60)
            this.space.addConstraint(mouseJoint)

            $(this.canvas).on('mousemove', function(e) {
                if (me.gameOver) {
                    return
                }
                mouseBody.p.x = e.clientX - $(me.canvas).offset().left
            })
        }

        ,initializeCollisionHandler: function() {
            var me = this

            this.space.setDefaultCollisionHandler(function(arbiter, space) {
                var a = arbiter.a
                    ,b = arbiter.b

                if ((a.dead || b.dead) && ('burger' == a.type || 'burger' == b.type)) {
                    switch (a.type + '-' + b.type) {
                        case 'burger-disk':
                        case 'disk-burger':
                        case 'burger-burger':
                            return false
                    }
                }
                return true

            }, null, function(arbiter, space) {
                var a = arbiter.a
                    ,b = arbiter.b

                if (a.dead || b.dead || (a.type != 'burger' && b.type != 'burger') || (a.inDisk && b.inDisk)) {
                    return
                }

                switch (a.type + '-' + b.type) {
                    case 'burger-floor':
                        a = arbiter.b
                        b = arbiter.a
                    case 'floor-burger':
                        me.removeBurger(b)
                        break

                    case 'burger-disk':
                        a = arbiter.b
                        b = arbiter.a
                    case 'disk-burger':
                        if (v.dist(a.body.p, b.body.p) < 70 && !b.inDisk) {
                            me.addToDisk(b)
                            var dist = v.dist(a.body.p, b.body.p)
                                ,minDist = (a.height + b.height) / 2
                                ,offset = dist - minDist
                            me.addScore(offset, b.body.p)
                        }
                        break

                    case 'burger-burger':
                        if ((a.inDisk || b.inDisk) && (a == me.currentBurger || b == me.currentBurger)) {
                            if (b.inDisk) {
                                var tmp = a
                                a = b
                                b = tmp
                            }

                            if (me.inDisk.indexOf(a) != -1) {
                                var dist = v.dist(a.body.p, b.body.p)
                                if (dist < a.height / 2 + b.height / 2 + 20 && Math.abs(me.toDeg(a.body.a)) < 30) {
                                    me.addToDisk(b)

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

        ,addToDisk: function(burger) {
            if (this.gameOver || burger.inDisk) {
                return this
            }

            var me = this

            burger.inDisk = true

            if (!this.inDisk.length) {
                var joint1 = new cp.DampedSpring(this.disk.body, burger.body, v(-100,10), v(-burger.width / 2,-burger.height / 2), 10, 1000,.3)
                    ,joint2 = new cp.DampedSpring(this.disk.body, burger.body, v(100,10), v(burger.width / 2,-burger.height / 2), 10, 1000,.3)
                    joint1.errorBias = Math.pow(1 - .15, 60)
                    joint2.errorBias = Math.pow(1 - .15, 60)
                    joint1.maxForce = 10
                    joint2.maxForce = 10
                this.addPostStepCallback(function() {
                    me.space.addConstraint(joint1)
                    me.space.addConstraint(joint2)
                })
            } else {
                var lastInDisk = this.inDisk[this.inDisk.length - 1]
                var joint1 = new cp.DampedSpring(lastInDisk.body, burger.body, v(-lastInDisk.width / 2, 0), v(-burger.width / 2, -burger.height / 2), 10, 100,.3)
                    ,joint2 = new cp.DampedSpring(lastInDisk.body, burger.body, v(lastInDisk.width / 2, 0), v(burger.width / 2, -burger.height / 2), 10, 100,.3)
                joint1.errorBias = Math.pow(1 - .15, 60)
                joint2.errorBias = Math.pow(1 - .15, 60)

                joint1.preSolve = function() {
                    if (Math.abs(me.toDeg(this.b.a)) > 30) {
                        me.addPostStepCallback(function() {
                            me.space.removeConstraint(joint1)
                            me.space.removeConstraint(joint2)
                        })
                        me.removeFromDisk(this.b.shapeList[0])
                        me.endGame()
                    }
                }

                this.addPostStepCallback(function() {
                    me.space.addConstraint(joint1)
                    me.space.addConstraint(joint2)
                    joint1.maxForce = 10
                    joint2.maxForce = 10
                })
            }

            this.inDisk.push(burger)

            this.updateOffsetHeight()
        }

        ,updateOffsetHeight: function(offsetHeight) {
            var me = this

            if (undefined === offsetHeight) {
                var totalBurgerHeight = 0

                for (var i = 0, len = this.inDisk.length; i < len; i++) {
                    totalBurgerHeight += this.inDisk[i].height
                }

                offsetHeight = totalBurgerHeight - 200
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

        ,removeFromDisk: function(burger) {
            burger.inDisk = false
            this.inDisk.splice(this.inDisk.indexOf(burger), 1)

            this.updateOffsetHeight()
            return this
        }

        ,addScore: function(offset, pos) {
            pos = this.point2canvas(pos)

            var score = 1
            if (offset < 2) {
                score = 5
            } else if (offset < 5) {
                score = 3
            }

            $.post('/play/update', {'score': score})

            this.totalSuccessBurgers++
            this.totalScore += score
            this.scores.push({score: score, pos: pos})

            $('.totalScore .numOutline').text(this.totalScore)
            $('.burgerKind ul').prepend('<li><span class="icon Burger02"></span>' + score + '</li>')
        }

        ,endGame: function() {
            if (this.gameOver) {
                return this
            }

            this.gameOver = true

            var me = this
                ,popup = $('#messPopup')

            me.updateOffsetHeight(0)

            $.post('/play/end', function(result) {
                setTimeout(function() {
                    me.running = false
                    popup.show().fadeOut(0).fadeIn()
                    popup.find('.numScore').text(me.totalScore)
                    popup.find('.play-time').text(me.getPlayTime(result.time, true))
                    popup.find('.num-burger').text(me.totalSuccessBurgers)
                }, 1000)
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