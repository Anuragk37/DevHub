from rest_framework import serializers
from .models import *
from admin_panel.models import Skill
from account.serializers import UserSerializer
from admin_panel.serializers import SkillSerializer
from account.models import MyUser

class TeamSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamSkill
        fields = ['id', 'team', 'skill']



class TeamSerializer(serializers.ModelSerializer):
    skills_required = serializers.SerializerMethodField(read_only=True)
    profile_pic_url = serializers.SerializerMethodField()
    creator = UserSerializer(read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'creator', 'members_required', 'created_date', 'skills_required', 'profile_pic', 'profile_pic_url']
        read_only_fields = ['creator', 'created_date']

    def get_skills_required(self, obj):
        team_skills = TeamSkill.objects.filter(team=obj)
        skills = Skill.objects.filter(id__in=[ts.skill.id for ts in team_skills])
        return SkillSerializer(skills, many=True).data

    def get_profile_pic_url(self, obj):
        request = self.context.get('request')
        if request and obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None

class TeamInvitationSerializer(serializers.ModelSerializer):
    team = TeamSerializer()
    user = UserSerializer()
    class Meta:
        model = TeamInvitation
        fields = ['id', 'team', 'user', 'invited_at']

class TeamInterestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all())
    class Meta:
        model = TeamInterest
        fields = ['id', 'team', 'user','status', 'expressed_at']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = UserSerializer(instance.user, context=self.context).data
        return representation

class TeamMemberSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all())
    class Meta:
        model = TeamMember
        fields = ['id', 'team', 'user', 'joined_at']
