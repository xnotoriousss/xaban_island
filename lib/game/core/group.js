ig.module('game.core.group')
.requires(
    'game.core.creatures'
)

.defines(function() { "use strict";
         
    ig.Group = {
        group: [],
        
        createGroup: function(creator, f, m){
            var fam = f ? f:null;
            var max = m ? m:10;
            var index = -1;
            var group = {  
                family: fam, //null, or class
                max: max, //number
                leader: null, //entity (i set it as leader later)
                target: null, //entity
                member: [] //entity, entity, entity, entity, etc.
            };
            var emptyIndex = this.group.indexOf(null);
            index = emptyIndex;
            if(index == -1){
                this.group.push(group);
                index = this.group.length-1;
            }else{
                this.group[index] = group;
            }
            ig.log(index);
            if(creator){
                this.addMember(creator,index);
                this.setLeader(creator, index);
            }
            return index;
        },
        setLeader: function(entity, ind, force){
            var index = ind ? ind: entity.groupIndex;
            if(entity){
                if(index != -1){
                    if(!this.group[index].leader){
                        entity.leader = true;
                        this.group[index].leader = entity;
                    }else{
                        if(force){
                            var oldLeader;
                            for(var i=0;i<this.group[index].member.length;i++){
                                if(this.group[index].member[i].leader){
                                    oldLeader = this.group[index].member[i];
                                    oldLeader.leader = false;
                                }
                            }
                            entity.leader = true;
                            this.group[index].leader = entity;
                            ig.log(entity.displayName + " replaced "+ oldLeader.displayName + " as the leader.");
                        }else{
                            ig.log("Already has leader.");
                        }
                    }
                }
            }
        },
        removeGroup: function(indexGroup){
            ig.log("Group "+indexGroup+ " was removed.");
            for(var i=0;i<this.group[indexGroup].member.length;i++){
                this.group[indexGroup].member[i].groupIndex = -1;
                this.group[indexGroup].member[i].memberIndex = -1;
            }
            this.group.splice(indexGroup, 1, null);
            
        },
        removeMember: function(indexMember, indexGroup){
            ig.log(entity.displayName + " was removed from group " + indexGroup + ".");
            this.group[indexGroup].member[indexMember].groupIndex = -1;
            this.group[indexGroup].member[indexMember].memberIndex = -1;
            this.group[indexGroup].member.splice(indexMember, 1, null);
            
        },
        addMember: function(entity, indexGroup){
            var index = -1;
            var fam = ig.Creatures.getCreatureFamily(entity);
            var currentGroup = this.group[indexGroup];
            
            if(!currentGroup.family||currentGroup.family === fam){
                var emptyIndex = currentGroup.member.indexOf(null);
                
                if(emptyIndex != -1){
                        index = emptyIndex;
                        this.group[indexGroup].member[index] = entity;
                }else{
                    
                    ig.log("No empty indexes.");
                    if(currentGroup.length != currentGroup.max){
                        this.group[indexGroup].member.push(entity);
                        index = this.group[indexGroup].member.length;
                    }else{
                        
                       ig.log("Group is full.");
                    }
                }
                
            }else{
                ig.log("Wrong family type.");
            }
            
            return index;
        }
    };
});
