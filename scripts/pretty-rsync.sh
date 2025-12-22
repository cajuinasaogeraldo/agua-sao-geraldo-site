awk '
BEGIN {
  del=add=content=time=size=perm=owner=dir=other=0
}

/^\*deleting/ {
  del++; d[del]=$2
  next
}

/^>f\+/ {
  add++; a[add]=$2
  next
}

/^cd\+/ {
  dir++; r[dir]=$2
  next
}

# Content definido: checksum OU (size+time juntos)
/^>fc/ || /^>f\.st/ {
  content++; c[content]=$2
  next
}

# Size mudou (sem time junto)
/^>f\.s[^t]/ {
  size++; s[size]=$2
  next
}

# Só timestamp (sem size)
/^>f\.[^s].*T/ {
  time++; t[time]=$2
  next
}

# Permissões
/^>f.*p/ {
  perm++; p[perm]=$2
  next
}

# Owner/group
/^>f.*[og]/ {
  owner++; o[owner]=$2
  next
}

# Qualquer outro >f
/^>f/ {
  other++; u[other]=$2 " [" $0 "]"
  next
}

END {
  if (del) {
    print "🗑  DELETE (" del ")"
    for (i=1; i<=del; i++) print "   - " d[i]
    print ""
  }
  if (add) {
    print "➕ ADD (" add ")"
    for (i=1; i<=add; i++) print "   + " a[i]
    print ""
  }
  if (dir) {
    print "📁 NEW DIR (" dir ")"
    for (i=1; i<=dir; i++) print "   • " r[i]
    print ""
  }
  if (content) {
    print "📝 CONTENT CHANGED (" content ")"
    for (i=1; i<=content; i++) print "   ≠ " c[i]
    print ""
  }
  if (size) {
    print "📏 SIZE CHANGED (" size ")"
    for (i=1; i<=size; i++) print "   ⚖ " s[i]
    print ""
  }
  if (time) {
    print "🕐 TIMESTAMP ONLY (" time ")"
    for (i=1; i<=time; i++) print "   ⏱ " t[i]
    print ""
  }
  if (perm) {
    print "🔒 PERMISSIONS (" perm ")"
    for (i=1; i<=perm; i++) print "   🔑 " p[i]
    print ""
  }
  if (owner) {
    print "👤 OWNER/GROUP (" owner ")"
    for (i=1; i<=owner; i++) print "   👥 " o[i]
    print ""
  }
  if (other) {
    print "❓ OTHER (" other ")"
    for (i=1; i<=other; i++) print "   ? " u[i]
    print ""
    print "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print "📖 Format: YXcstpoguax"
    print "   c=checksum s=size t=time p=perms"
    print "   o=owner g=group +=new"
  }
}
'